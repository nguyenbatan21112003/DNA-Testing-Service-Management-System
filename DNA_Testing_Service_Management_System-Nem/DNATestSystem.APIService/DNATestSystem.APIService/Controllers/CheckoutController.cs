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

                if (response.VnPayResponseCode != "00")
                {
                    var failRedirect = $"http://localhost:5173/payment-success?status=fail&message=Thanh%20toan%20bi%20huy%20hoac%20that%20bai";
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
                    ❌ Thanh toán thất bại hoặc bị hủy. Đang chuyển hướng...
                </h3>
            </body>
        </html>";
                    return Content(failHtml, "text/html");
                }

                if (!response.Success)
                {
                    // Redirect về FE báo lỗi
                    var failRedirect = $"http://localhost:5173/payment-success?status=fail&message=Thanh%20toan%20that%20bai";
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
                            ❌ Thanh toán thất bại. Đang chuyển hướng...
                        </h3>
                    </body>
                </html>";
                    return Content(failHtml, "text/html");
                }

                var invoice = new Invoice
                {
                    RequestId = int.Parse(response.OrderId), // Giả định luôn đúng
                    PaidAt = DateTime.UtcNow
                };

                _context.Invoices.Add(invoice);

                var testRequest = await _context.TestRequests.FindAsync(invoice.RequestId);
                if (testRequest != null)
                {
                    testRequest.Status = "pending";
                    _context.TestRequests.Update(testRequest);
                }

                await _context.SaveChangesAsync();

                // Redirect về FE báo thành công
                var redirectUrl = $"http://localhost:5173/payment-success?" +
                   $"status=success" +
                   $"&message={Uri.EscapeDataString("Thanh toán thành công")}" +
                   $"&transactionId={response.TransactionId}" +
                   $"&requestId={invoice.RequestId}" +
                   $"&paidAt={Uri.EscapeDataString(invoice.PaidAt?.ToString("s") ?? "")}";


                var html = $@"
            <html>
                <head>
                    <meta http-equiv='refresh' content='1;url={redirectUrl}' />
                    <script>
                        setTimeout(function() {{
                            window.location.href = '{redirectUrl}';
                        }}, 1000);
                    </script>
                </head>
                <body>
                    <h3 style='text-align:center;margin-top:40px;color:green;'>
                        ✅ Thanh toán thành công. Đang chuyển hướng...
                    </h3>
                </body>
            </html>";

                return Content(html, "text/html");
            }
            catch (Exception ex)
            {
                var errorUrl = $"http://localhost:5173/payment-success?status=fail&message=Loi%20he%20thong";
                var errorHtml = $@"
            <html>
                <head>
                    <meta http-equiv='refresh' content='2;url={errorUrl}' />
                    <script>
                        setTimeout(function() {{
                            window.location.href = '{errorUrl}';
                        }}, 2000);
                    </script>
                </head>
                <body>
                    <h3 style='text-align:center;margin-top:40px;color:red;'>
                        ❌ Lỗi hệ thống. Đang chuyển hướng...
                    </h3>
                </body>
            </html>";
                return Content(errorHtml, "text/html");
            }
        }


    }
}
