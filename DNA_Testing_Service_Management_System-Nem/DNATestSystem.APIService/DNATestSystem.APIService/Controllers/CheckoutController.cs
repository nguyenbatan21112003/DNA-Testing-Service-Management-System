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

                if (!response.Success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Thanh toán thất bại",
                        vnPayResponseCode = response.VnPayResponseCode
                    });
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

                return Ok(new
                {
                    success = true,
                    message = "Thanh toán thành công",
                    transactionId = response.TransactionId,
                    requestId = invoice.RequestId,
                    paidAt = invoice.PaidAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi hệ thống",
                    error = ex.Message
                });
            }
        }


    }
}
