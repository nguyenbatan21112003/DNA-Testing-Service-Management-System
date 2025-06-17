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
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }
        [HttpPost("create-manager")]
        public IActionResult CreateManager([FromBody] ManagerCreateModel model)
        {
            var userId = _adminService.CreateManager(model);
            return Ok(new { message = "Tạo tài khoản Manager thành công", userId });
        }

        [HttpPost("create-staff")]
        public IActionResult CreateStaff([FromBody] StaffCreateModel model)
        {
            var userId = _adminService.CreateStaff(model);
            return Ok(new { message = "Tạo tài khoản Staff thành công", userId });
        }

        [HttpPut("update-role-status")]
        public IActionResult UpdateUserRoleAndStatus([FromBody] UpdateStatusAndRoleModel model)
        {
            try
            {
                _adminService.UpdateStatusAndRole(model);
                return Ok(new { message = "Cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("ban-user/{id}")]
        public IActionResult BanUser(int id)
        {
            try
            {
                var userId = _adminService.BanUserById(id);
                return Ok(new { message = "Đã khóa tài khoản thành công", userId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getUser")]
        public IActionResult GetAllUser()
        {
            var users = _adminService.getAllUser();
            return Ok(users);
        }

        

    }
}
