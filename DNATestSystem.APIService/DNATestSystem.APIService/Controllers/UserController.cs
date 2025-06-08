using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using DNATestSystem.BusinessObjects.Entites;
using DNATestSystem.Services;

using Microsoft.AspNetCore.Authorization;
using DNATestSystem.Application.Dtos;
using DNATestSystem.Services.Service;

namespace DNATestSystem.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost("register")]
        public IActionResult Register(UserRegisterModel users)
        {
            if (!ModelState.IsValid)
            {
                // Trả tất cả lỗi dưới dạng JSON
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { message = "Đăng ký thất bại", errors });
            }

            var id = _userService.Register(users);
            return Ok(new { message = "Đăng ký thành công", id });
        }
        
        [HttpPost("login")]
        public IActionResult Login(UserLoginModel users)
        {
            //if (!ModelState.IsValid)
            //{   
            //    return BadRequest(ModelState);
            //}
            //return Ok(_userService.Login(users));
            var user = _userService.Login(users);
            if (user == null)
            {
                return BadRequest(new { message = "Username or password is wrong" });
            }
            var token = _userService.GenerateJwt(user);
            return Ok(token);
        } 
        
        [HttpPost("/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok();
        }

        [HttpPost("verify-current-password")]
        public IActionResult VerifyCurrentPassword([FromBody] VerifyPasswordModel model)
        {
            if (_userService.VerifyCurrentPassword(model.Email, model.CurrentPassword))
                return Ok("Password correct");
            return BadRequest("Invalid password");
        }

        [HttpPost("request-password-change")]
        public IActionResult RequestPasswordChange([FromBody] ChangePasswordRequest model)
        {
            _userService.RequestPasswordChange(model.Email, model.NewPassword);
            return Ok("OTP sent");
        }

        [HttpPost("confirm-otp")]
        public IActionResult ConfirmOtp([FromBody] ConfirmOtpModel model)
        {
            if (_userService.ConfirmOtp(model.Email, model.Otp))
                return Ok("Password changed successfully");
            return BadRequest("Invalid OTP");
        }

        [Authorize]
        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordWhenLoggedInModel model)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!_userService.VerifyCurrentPassword(email, model.CurrentPassword))
            {
                return BadRequest("Mật khẩu hiện tại không chính xác.");
            }

            _userService.ChangePassword(email, model.NewPassword);
            return Ok("Đổi mật khẩu thành công.");
        }
        //[Authorize]
        //[HttpPost("verify-current-password")]
        //public IActionResult VerifyCurrentPassword([FromBody] string currentPassword)
        //{
        //    var email = User.FindFirstValue(ClaimTypes.Email);
        //    var user = _context.Users.FirstOrDefault(u => u.EmailAddress == email);
        //    if (user == null) return Unauthorized();

        //    bool isValid = BCrypt.Net.BCrypt.Verify(currentPassword, user.Password);
        //    if (!isValid) return BadRequest("Current password is incorrect.");

        //    return Ok("Password verified. Continue.");
        //}


    }
}

