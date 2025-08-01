﻿using DNATestSystem.APIService.ActionFilter;
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
        public async Task<IActionResult> CreateManager([FromBody] ManagerCreateModel model)
        {
            var userId = await _adminService.CreateManagerAsync(model);
            return Ok(new { message = "Tạo tài khoản Manager thành công", userId });
        }

        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromBody] StaffCreateModel model)
        {
            var userId = await _adminService.CreateStaffAsync(model);
            return Ok(new { message = "Tạo tài khoản Staff thành công", userId });
        }

        [HttpPut("update-role-status")]
        public async Task<IActionResult> UpdateUserRoleAndStatus([FromBody] UpdateStatusAndRoleModel model)
        {
            try
            {
                await _adminService.UpdateStatusAndRoleAsync(model);
                return Ok(new { message = "Cập nhật thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("ban-user/{id}")]
        public async Task<IActionResult> BanUser(int id)
        {
            try
            {
                var userId = await _adminService.BanUserByIdAsync(id);
                return Ok(new { message = "Đã khóa tài khoản thành công", userId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getAllUser")]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await _adminService.GetAllUserAsync();
            return Ok(users);
        }
        [HttpPut("update-phone-number-name-status")]
        public async Task<IActionResult> UpdatePhoneNumberNameAndStatus([FromBody] UpdatePhoneNumberNameAndStatus model)
        {
            try
            {
                var result = await _adminService.UpdatePhoneNumberNameAndStatusAsync(model);
                if (result)
                {
                    return Ok(new { message = "Cập nhật thành công" });
                }
                else
                {
                    return BadRequest(new { message = "Cập nhật không thành công" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
