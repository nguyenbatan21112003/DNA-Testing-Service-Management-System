using DNATestSystem.BusinessObjects.Application.Dtos.BlogPost;
using System.Security.Claims;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "3")]
    public class ManagerController : Controller
    {
        private readonly IManagerService _managerService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ManagerController(IManagerService managerService, IHttpContextAccessor httpContextAccessor)
        {
            _managerService = managerService;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet("test-results/pending")]
        public IActionResult GetPendingTestResults()
        {
            var results = _managerService.GetPendingTestResultsAsync();
            return Ok(results);
        }
        [HttpPut("verify")]
        public async Task<IActionResult> VerifyTestResult([FromBody] VertifyTestResult dto)
        {
            var success = await _managerService.VerifyTestResultAsync(dto);

            if (!success)
            {
                return NotFound(new
                {
                    success = false,
                    message = "TestResult not found or already verified."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Verified successfully."
            });
        }
        [HttpPost("create-BlogPost")]
        public async Task<IActionResult> CreateBlogPost([FromBody] BlogPostDto dto)
        {
            // Lấy AuthorId từ JWT nếu cần
            var authorId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(authorId, out var parsedId))
            {
                return Unauthorized("Không xác định được người viết.");
            }

            dto.AuthorId = parsedId;

            var result = await _managerService.AssignBolgPostsAsync(dto);
            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }
        [HttpGet("get-all-feedBack")]
        public async Task<IActionResult> GetAllFeedbacks()
        {
            var result = await _managerService.GetAllFeedbacksAsync();
            return Ok(new { success = true, data = result });
        }
        [HttpGet("all-test-requests")]
        public async Task<IActionResult> GettAllTestRequests()
        {
            try
            {
                var result = await _managerService.GetAllTestRequest();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("all-test-results")]
        public async Task<IActionResult> GetAllTestResults()
        {
            try
            {
                var result = await _managerService.GetAllTestResultsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("all-test-samples")]
        public async Task<IActionResult> GetAllManagerTestSample()
        {
            try
            {
                var result = await _managerService.GetAllManagerTestSample();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpPut("update-test-result")]
        public async Task<IActionResult> UpdateTestResult([FromBody] ManagerUpdateTestResultDto model)
        {
            try
            {
                var result = await _managerService.UpdateTestResultByTestResultId(model);
                if (result)
                {
                    return Ok(new { success = true, message = "Cập nhật kết quả kiểm tra thành công." });
                }
                else
                {
                    return NotFound(new { success = false, message = "Không tìm thấy kết quả kiểm tra." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("all-BlogPost")]
        public async Task<IActionResult> GetAllBlogPosts()
        {
            try
            {
                var result = await _managerService.GetAllBlogPostsAsync();
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpGet("all-test-process")]
        public async Task<IActionResult> GetAllTestProcess()
        {
            try
            {
                var result = await _managerService.GetAllTestProcess();
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }

        }
    }
}
