using DNATestSystem.BusinessObjects.Vnpay;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUserService _userService;
        public PaymentController(IVnPayService vnPayService , IUserService userService)
        {
            _userService = userService;
            _vnPayService = vnPayService;
        }
        [HttpPost("create-vnpay-url")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new
            {
                status = "true",
                paymentUrl = url
            });
        }

    }
}
