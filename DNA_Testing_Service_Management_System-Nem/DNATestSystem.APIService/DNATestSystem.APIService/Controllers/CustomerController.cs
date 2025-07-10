using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "1")]
    public class CustomerController : ControllerBase
    {
        private readonly IUserService _userService;

        public CustomerController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost("/send-FeedBack")]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedBackDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                dto.UserId = userId;

                var result = await _userService.CreateFeedBack(dto);
                return Ok(new { success = true, message = "Gửi feedback thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
