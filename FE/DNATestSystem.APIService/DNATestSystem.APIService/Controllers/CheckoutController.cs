using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IApplicationDbContext _context;

        public CheckoutController(IVnPayService vnPayService , IApplicationDbContext dbContext)
        {
            _vnPayService = vnPayService;
            _context = dbContext;
        }

        [HttpGet("PaymentCallbackVnpay")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (response.VnPayResponseCode != "00" || !response.Success)
                {
                    var failMessage = response.VnPayResponseCode != "00"
                        ? "Thanh toán bị huỷ hoặc thất bại"
                        : "Thanh toán thất bại";

                    var failRedirect = $"http://localhost:5173/payment-success?status=fail&message={Uri.EscapeDataString(failMessage)}";
                    var failHtml = $@"
            <html>
                <head>
                    <meta http-equiv='refresh' content='2;url={failRedirect}' />
                    <script>
                        setTimeout(function() {{
                            window.location.href = '{failRedirect}';
                        }}, 2000);
                    </script>
                </head>
                <body>
                    <h3 style='text-align:center;margin-top:40px;color:red;'>
                        ❌ {failMessage}. Đang chuyển hướng...
                    </h3>
                </body>
            </html>";
                    return Content(failHtml, "text/html");
                }

                if (!int.TryParse(response.OrderId, out int requestId))
                {
                    Console.WriteLine("❌ OrderId không hợp lệ: " + response.OrderId);
                    return Content(CreateRedirectHtml("http://localhost:5173/payment-success?status=fail&message=Ma%20don%20hang%20khong%20hop%20le"), "text/html");
                }

                var testRequest = await _context.TestRequests.FindAsync(requestId);
                if (testRequest == null)
                {
                    Console.WriteLine("❌ Không tìm thấy test request với ID: " + requestId);
                    return Content(CreateRedirectHtml("http://localhost:5173/payment-success?status=fail&message=Khong%20tim%20thay%20don%20hang"), "text/html");
                }

                testRequest.Status = "pending";
                _context.TestRequests.Update(testRequest);

                var invoice = new Invoice
                {
                    RequestId = requestId,
                    PaidAt = DateTime.UtcNow
                };
                _context.Invoices.Add(invoice);

                await _context.SaveChangesAsync();

                var redirectUrl = $"http://localhost:5173/payment-success?" +
                   $"status=success" +
                   $"&message={Uri.EscapeDataString("Thanh toán thành công")}" +
                   $"&transactionId={response.TransactionId}" +
                   $"&requestId={invoice.RequestId}" +
                   $"&paidAt={Uri.EscapeDataString(invoice.PaidAt?.ToString("s") ?? "")}";

                return Content(CreateRedirectHtml(redirectUrl, true), "text/html");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Exception tại PaymentCallback: " + ex.Message);
                var errorRedirect = "http://localhost:5173/payment-success?status=fail&message=Loi%20he%20thong";
                return Content(CreateRedirectHtml(errorRedirect), "text/html");
            }
        }

        // Hàm tiện ích tạo HTML redirect
        private string CreateRedirectHtml(string url, bool success = false)
        {
            var color = success ? "green" : "red";
            var message = success ? "✅ Thanh toán thành công." : "❌ Thanh toán thất bại.";
            return $@"
    <html>
        <head>
            <meta http-equiv='refresh' content='2;url={url}' />
            <script>
                setTimeout(function() {{
                    window.location.href = '{url}';
                }}, 2000);
            </script>
        </head>
        <body>
            <h3 style='text-align:center;margin-top:40px;color:{color};'>
                {message} Đang chuyển hướng...
            </h3>
        </body>
    </html>";
        }


    }
}
