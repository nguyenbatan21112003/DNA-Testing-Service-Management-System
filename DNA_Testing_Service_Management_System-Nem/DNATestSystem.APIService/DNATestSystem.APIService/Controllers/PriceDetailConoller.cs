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
        public IActionResult CreatePriceDetail([FromBody] PriceDetailsModel model)
        {
            var id = _priceDetails.CreatePriceDetailMethod(model);
            return Ok(new { message = "Tạo bảng giá thành công", id });
        }

        [HttpPut("Update/{id}")]
        public IActionResult UpdatePriceDetail(int id, [FromBody] PriceDetailsModel model)
        {
            _priceDetails.UpdatePriceDetailMethod(id, model);
            return Ok(new { message = "Cập nhật bảng giá thành công" });
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult DeletePriceDetail(int id)
        {
            _priceDetails.DeletePriceDetailMethod(id);
            return Ok(new { message = "Xoá bảng giá thành công" });
        }
    }
}
