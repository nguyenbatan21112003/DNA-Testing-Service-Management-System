using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using System.Globalization;
using DNATestSystem.BusinessObjects.Vnpay;

namespace DNATestSystem.BusinessObjects.Libraries
{
    public class VnPayLibrary
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public PaymentResponseModel GetFullResponseData(IQueryCollection collection, string hashSecret)
        {
            var vnPay = new VnPayLibrary();
            foreach (var (key, value) in collection)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            var orderIdRaw = vnPay.GetResponseData("vnp_TxnRef");
            var tranIdRaw = vnPay.GetResponseData("vnp_TransactionNo");

            if (!long.TryParse(orderIdRaw, out var orderId))
                orderId = 0;

            if (!long.TryParse(tranIdRaw, out var vnPayTranId))
                vnPayTranId = 0;

            var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            var vnpSecureHash = vnPay.GetResponseData("vnp_SecureHash");
            var orderInfo = vnPay.GetResponseData("vnp_OrderInfo");

            //var checkSignature = vnPay.ValidateSignature(vnpSecureHash, hashSecret);

            //if (!checkSignature)
            //    return new PaymentResponseModel()
            //    {
            //        Success = false
            //    };
            var checkSignature = vnPay.ValidateSignature(vnpSecureHash, hashSecret);

            if (!checkSignature)
            {
                Console.WriteLine("⚠️ Lỗi hash: dữ liệu bị sai hoặc thiếu");
                Console.WriteLine($"🔐 Mã hash từ VNPay: {vnpSecureHash}");
                Console.WriteLine($"🔎 Chuỗi cần hash lại: {vnPay.GetResponseData()}");
                Console.WriteLine($"🔐 Kết quả tự tính lại: {vnPay.HmacSha512(hashSecret, vnPay.GetResponseData())}");

                // Tạm thời vẫn trả dữ liệu để debug
                return new PaymentResponseModel()
                {
                    Success = false,
                    VnPayResponseCode = vnpResponseCode,
                    OrderDescription = orderInfo,
                    Token = vnpSecureHash,
                    OrderId = orderIdRaw,
                    TransactionId = tranIdRaw
                };
            }


            return new PaymentResponseModel()
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = orderInfo,
                OrderId = orderId.ToString(),
                PaymentId = vnPayTranId.ToString(),
                TransactionId = vnPayTranId.ToString(),
                Token = vnpSecureHash,
                VnPayResponseCode = vnpResponseCode
            };
        }


        public string GetIpAddress(HttpContext context)
        {
            var ipAddress = string.Empty;
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;

                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }

                    if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                    return ipAddress;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "127.0.0.1";
        }

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData.Add(key, value);
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData.Add(key, value);
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();
            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }

            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            //remove last '&'
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }

            return data.ToString();
        }

        //public bool ValidateSignature(string inputHash, string secretKey)
        //{
        //    var rspRaw = GetResponseData();
        //    var myChecksum = HmacSha512(secretKey, rspRaw);
        //    return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        //}

        public bool ValidateSignature(string inputHash, string secretKey)
        {
            var rspRaw = GetResponseData();
            var myChecksum = HmacSha512(secretKey, rspRaw);

            Console.WriteLine("🔎 RESPONSE RAW: " + rspRaw);
            Console.WriteLine("🔐 EXPECTED HASH: " + myChecksum);
            Console.WriteLine("🆚 VNPay HASH:     " + inputHash);

            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }


        public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
        {
            var data = new StringBuilder();

            foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
            {
                data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
            }

            var querystring = data.ToString().TrimEnd('&'); // bỏ dấu & cuối
            var vnpSecureHash = HmacSha512(vnpHashSecret, querystring);

            var finalUrl = baseUrl + "?" + querystring + "&vnp_SecureHash=" + vnpSecureHash;

            Console.WriteLine("🔐 SIGN DATA: " + querystring);
            Console.WriteLine("🔗 Final URL: " + finalUrl);

            return finalUrl;
        }


        private string HmacSha512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

    }
}
public class VnPayCompare : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x == y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}


