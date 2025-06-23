using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "4")]
    public class PriceDetailConoller : ControllerBase
    {
        private readonly IPriceDetails _priceDetails;

        public PriceDetailConoller(IPriceDetails priceDetails) 
        {
            _priceDetails = priceDetails;
        }
        [HttpPost]
        public async Task<IActionResult> CreatePriceDetail([FromBody] PriceDetailsModel model)
        {
            var id = await _priceDetails.CreatePriceDetailMethodAsync(model);
            return Ok(new { message = "Tạo bảng giá thành công", id });
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdatePriceDetail(int id, [FromBody] PriceDetailsModel model)
        {
            await _priceDetails.UpdatePriceDetailMethodAsync(id, model);
            return await Task.FromResult(Ok(new { message = "Cập nhật bảng giá thành công" }));
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeletePriceDetailAsync(int id)
        {
             await _priceDetails.DeletePriceDetailMethodAsync(id);
            return await Task.FromResult(Ok(new { message = "Xoá bảng giá thành công" }));
        }
    }
}
