﻿using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DNATestSystem.Services.Interface;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.UserProfile;
using DNATestSystem.APIService.PDF;
using DNATestSystem.Services.Service;
using QuestPDF.Fluent;

namespace DNATestSystem.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IUserService userService, IHttpContextAccessor httpContextAccessor)
        {
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel users)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { message = "Đăng ký thất bại", errors });
            }

            var id = await _userService.RegisterAsync(users);
            return Ok(new { message = "Đăng ký thành công", id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginModel users)
        {
            var user = await _userService.LoginAsync(users);
            if (user == null)
            {
                return BadRequest("Username or password is wrong");
            }
            else if (user.Status == -1)
            {
                return BadRequest("This account have been banned pls contact to admin !");
            }

            var newOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
            };
            var accessToken = await _userService.GenerateJwtAsync(user);
            var refreshToken = await _userService.GenerateRefreshTokenAsync(user.UserId);
            HttpContext.Response.Cookies.Append("refreshToken", refreshToken, newOptions);
            return Ok(new { accessToken, user.RoleId, user.FullName, user.UserId });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var isExist = HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if (!isExist)
            {
                return Unauthorized("RefreshToken is not found");
            }
            var user = await _userService.GetUserByRefreshTokenAsync(refreshToken!);
            if (user == null)
            {
                return Unauthorized("RefreshToken is not found");
            }

            await _userService.DeleteOldRefreshTokenAsync(user.UserId);

            var newOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
            };
            var accessToken = await _userService.GenerateJwtAsync(user);
            var mew_refreshToken = await _userService.GenerateRefreshTokenAsync(user.UserId);
            HttpContext.Response.Cookies.Append("refreshToken", mew_refreshToken, newOptions);
            return Ok(accessToken);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _userService.DeleteOldRefreshTokenAsync(refreshToken);
            }
            // Phải truyền lại options giống khi tạo cookie
            var options = new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None,
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(-1) // ép hết hạn
            };
            HttpContext.Session.Clear();
            HttpContext.Response.Cookies.Delete("refreshToken", options);
            return Ok();

        }

        [HttpGet("services")]
        public async Task<IActionResult> getAllService()
        {
            var data = await _userService.GetServiceForUserAsync();
            return Ok(data);
        }

        [HttpGet("services/{id}")]
        public async Task<IActionResult> getServiceById(int id)
        {
            var service = await _userService.GetServiceByIdAsync(id);
            if (service == null)
                return NotFound(new { message = "Service không tồn tại" });

            return Ok(service);
        }

        [HttpGet("blogPost")]
        public async Task<IActionResult> getAllBlogPsot()
        {
            var data = await _userService.GetAllBlogForUserAsync();
            return Ok(data);
        }

        [HttpGet("blogPost/{Slug}")]
        public async Task<IActionResult> getBlogPostBySlug(string Slug)
        {
            var Blog = await _userService.GetBlogPostDetailsModelAsync(Slug);
            if (Blog == null)
                return NotFound(new { message = "Blog không tồn tại" });
            return Ok(Blog);
        }

        [HttpGet("GetProfile/{profile_id}")]
        public async Task<IActionResult> GetProfile(int profile_id)
        {
            var result = await _userService.GetProfileUserAsync(profile_id);

            if (result == null)
                return NotFound("User not found.");

            return Ok(result);
        }

        [HttpGet("profile-image")]
        public async Task<IActionResult> GetProfileImage()
        {
            var data = await _userService.GetProfileByUser();
            if (data == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy hồ sơ người dùng." });
            }
            return Ok(new { success = true, data });
        }

        [Authorize]
        [HttpPut("UpdateUserProfile")]
        public async Task<IActionResult> UpdateProfileUser(UpdateProfileModel model)
        {
            var result = await _userService.UpdateProfileAsync(model);
            if (result == null)
                return NotFound(new { success = false, message = "Không tìm thấy hồ sơ người dùng." });

            return Ok(new { success = true, message = "Cập nhật hồ sơ thành công", data = result });
        }


        [HttpPost("verify-password")]
        public async Task<IActionResult> VerifyPassword([FromBody] UserVerifyCurrentPassword model)
        {
            var result = await _userService.VerifyCurrentPasswordAsync(model);
            return result ? Ok("Password verified.") : BadRequest("Incorrect password.");
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] UserChangePasswordModel model)
        {
            try
            {
                var data = new UserChangePasswordModel
                {
                    Email = User.FindFirstValue(ClaimTypes.Email),
                    CurrentPassword = model.CurrentPassword,
                    NewPassword = model.NewPassword
                };
                await _userService.ChangePasswordAsync(data);
                return Ok("Password changed successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("send-consult-request")]
        public async Task<IActionResult> SendConsultRequest([FromBody] SendConsultRequestModel model)
        {
            var data = _userService.SendConsultRequestAsync(model);
            return Ok(data);
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitTestRequest([FromBody] TestRequestSubmissionDto dto)
        {
            var result = await _userService.SubmitTestRequestAsync(dto);
            return result.Success ? Ok(result) : StatusCode(500, result);
        }
        [HttpGet("test-results/history")]
        public async Task<IActionResult> GetTestHistory(int userId)
        {
            var result = await _userService.GetTestRequestHistoryAsync(userId);

            if (result == null || !result.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy lịch sử xét nghiệm."
                });
            }

            return Ok(new
            {
                success = true,
                data = result
            });
        }

        [HttpPost("create-userProfile")]
        [Authorize]
        public async Task<IActionResult> CreateUserProfile([FromBody] UserProfileDto dto)
        {
            try
            {
                var result = await _userService.CreateUserProfile(dto);
                return Ok(new { success = result, message = "Tạo hồ sơ người dùng thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpPost("get-userProfile-ByEmail/{email}")]
        public async Task<IActionResult> GetUserProfileByEmail(string email)
        {
            try
            {
                var result = await _userService.GetUserProfileByEmail(email);
                if (result == null)
                {
                    return NotFound(new { success = false, message = "Không tìm thấy hồ sơ người dùng." });
                }
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("export-request-pdf/{requestId}")]
        public async Task<IActionResult> ExportRequestPdf(int requestId)
        {
            var data = await _userService.GetExportPdfDataAsync(requestId);
            if (data == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu xét nghiệm." });

            var stream = new MemoryStream();

            var document = new RequestPdfDocument(data); // bạn đã tạo class này để render PDF
            document.GeneratePdf(stream);
            stream.Position = 0;

            var fileName = $"DonXetNghiemCuaBan_{data.DeclarantName}.pdf";
            return File(stream, "application/pdf", fileName);
        }
    }
}







