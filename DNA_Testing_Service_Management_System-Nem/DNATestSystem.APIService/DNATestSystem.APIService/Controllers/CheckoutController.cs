using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public CheckoutController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpGet("PaymentCallbackVnpay")]

        public IActionResult PaymentCallbackVnpay()
        {
            try
            {
                Console.WriteLine("✅ Callback started");

                foreach (var item in Request.Query)
                    Console.WriteLine($"🔍 {item.Key} = {item.Value}");

                var response = _vnPayService.PaymentExecute(Request.Query);

                if (!response.Success)
                {
                    return Content($@"
                <html><body style='font-family:sans-serif;text-align:center;padding-top:50px;'>
                <h2 style='color:red;'>❌ Thanh toán thất bại</h2>
                <p>Mã lỗi: {response.VnPayResponseCode}</p>
                </body></html>", "text/html");
                }

                return Content($@"
            <html><body style='font-family:sans-serif;text-align:center;padding-top:50px;'>
            <h2 style='color:green;'>Thanh Toán thành công</h2>
            <p>Mã giao dịch: {response.TransactionId}</p>
            </body></html>", "text/html");
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 EXCEPTION: " + ex.Message);
                return Content("❌ Lỗi hệ thống: " + ex.Message, "text/html");
            }
        }

    }
}
