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

                foreach (var q in Request.Query)
                {
                    Console.WriteLine($"🔍 {q.Key} = {q.Value}");
                }

                var response = _vnPayService.PaymentExecute(Request.Query);

                if (!response.Success)
                {
                    Console.WriteLine("❌ VNPAY báo lỗi: " + response.VnPayResponseCode);
                    return Content("❌ Thanh toán thất bại", "text/html");
                }

                return Content("✅ Thanh toán thành công!", "text/html");
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 Callback exception: " + ex);
                return Content("❌ Lỗi hệ thống: " + ex.Message, "text/html");
            }
        }

    }
}
