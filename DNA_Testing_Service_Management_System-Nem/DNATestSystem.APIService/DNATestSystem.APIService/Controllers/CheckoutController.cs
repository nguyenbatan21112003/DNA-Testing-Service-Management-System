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

                if (!int.TryParse(response.OrderId, out var requestId))
                {
                    return BadRequest(new { success = false, message = "OrderId không hợp lệ" });
                }

                // Kiểm tra nếu invoice đã tồn tại -> bỏ qua tạo lại
                var existingInvoice = await _context.Invoices
                    .FirstOrDefaultAsync(i => i.RequestId == requestId);
                if (existingInvoice != null)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Đơn đã được thanh toán trước đó",
                        requestId = requestId,
                        paidAt = existingInvoice.PaidAt
                    });
                }

                // ✅ Ghi nhận thanh toán
                var invoice = new Invoice
                {
                    RequestId = requestId,
                    PaidAt = DateTime.UtcNow
                };

                _context.Invoices.Add(invoice);

               

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thanh toán thành công",
                    transactionId = response.TransactionId,
                    requestId = requestId,
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
