using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using DNATestSystem.BusinessObjects.Entities;
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
        public IActionResult Register([FromBody] UserRegisterModel users)
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

        [HttpPost("/login")]
        public async Task<IActionResult> Login(UserLoginModel users)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            //return Ok(_userService.Login(users));
            var user = _userService.Login(users);
            if (user == null)
            {
                return BadRequest("Username or password is wrong");
            }

            var newOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true
            };
            var accessToken = _userService.GenerateJwt(user);
            var refreshToken = _userService.GenerateRefreshToken(user.UserId);
            //mình nên return accessToken còn refreshToken thì nên lưu vào trong cookie
            HttpContext.Response.Cookies.Append("refreshToken", refreshToken, newOptions);
            return Ok(accessToken);
            //nếu hết hạn tk refreshToken thì cookie nó sẽ tự xóa

        }
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            var isExist = HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if (!isExist)
            {
                return Unauthorized("RefreshToken is not found");
            }
            var user = _userService.GetUserByRefreshToken(refreshToken!);
            if (user == null)
            {
                return Unauthorized("RefreshToken is not found");
            }
            //nếu như có tk refreshToken thì mình phải xóa nó đi
            _userService.DeleteOldRefreshToken(user.UserId);

            //sao đó là tạo mới
            var newOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true
            };
            var accessToken = _userService.GenerateJwt(user);
            var mew_refreshToken = _userService.GenerateRefreshToken(user.UserId);
            //mình nên return accessToken còn refreshToken thì nên lưu vào trong cookie
            HttpContext.Response.Cookies.Append("refreshToken", mew_refreshToken, newOptions);
            return Ok(accessToken);
        }

        [HttpPost("/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok();
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

