using DNATestSystem.APIService.ActionFilter;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.BusinessObjects.Entities.Enum;
using DNATestSystem.Services.Interface;
using DNATestSystem.Services.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "4")]
    public class ServiceController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public ServiceController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("create-service")]
        public IActionResult CreateNewService([FromBody] ServiceCreateModel model)
        {
            var serviceId = _adminService.CreateServiceMethod(model);
            return Ok(new { message = "Tạo service thành công", serviceId });
        }

        //[HttpDelete("delete-service/{id}")]
        //public IActionResult DeleteService(int id)
        //{
        //    try
        //    {
        //        var result = _adminService.DeleteServiceMethod(id);
        //        return Ok(new { message = "Xoá dịch vụ thành công", result });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}
       
        [HttpPut("delete-service/{id}")]
        public IActionResult SoftDeleteService(int id)
        {
            try
            {
                var deletedId = _adminService.DeleteServiceMethod(id);
                return Ok(new { message = "Xóa (ẩn) service thành công", serviceId = deletedId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Xóa thất bại", error = ex.Message });
            }
        }
        [HttpGet("all-services")]
        public IActionResult getAllService()
        {
            var data = _adminService.GetServiceForAdmin();
            return Ok(data);

        }
    }
}
