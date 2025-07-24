using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.Services.Service;

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

        [HttpGet("sample-collection/{processId}")]
        public async Task<IActionResult> GetCustomerSampleCollection(int processId)
        {
            var result = await _userService.GetSampleCollectionByCustomerAsync(processId);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy thông tin thu mẫu cho processId này." });

            return Ok(result);
        }
        [HttpGet("/test-requests")]
        public async Task<IActionResult> GetCustomerTestRequests()
        {
            var result = await _userService.GetTestRequestsByCustomerIdAsync();
            if (result == null)
                return NotFound(new { message = "Không tìm thấy yêu cầu xét nghiệm." });

            return Ok(result);

        }
        [HttpGet("test-process/{test_requestId}")]
        public async Task<IActionResult> GetTestProcessByTestRequestID([FromRoute] int test_requestId)
        {
            var data = await _userService.GetTestProcessByTestRequestAsync(test_requestId);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy test-process" });
            }
            return Ok(data);
        }
        [HttpGet("request-declarants/{test_requestId}")]
        public async Task<IActionResult> GetRequestDeclarantsByTestRequestID([FromRoute] int test_requestId)
        {
            var data = await _userService.GetRequestDeclarantsByTestRequestIdAsync(test_requestId);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy request-declarants" });
            }
            return Ok(data);
        }
        [HttpGet("test-sample/{test_requestId}")]
        public async Task<IActionResult> GetTestSampleByTestRequestId([FromRoute] int test_requestId)
        {
            var data = await _userService.GetSampleProvidersByTestRequestIdAsync(test_requestId);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy test-sample" });
            }
            return Ok(data);
        }
        [HttpGet("feedback")]
        public async Task<IActionResult> GetFeedBackByCustomerId()
        {
            var data = await _userService.GetFeedbackByCustomerIdAsync();
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy test-sample" });
            }
            return Ok(data);
        }
        [HttpGet("test-result{result_id}")]
        public async Task<IActionResult> GetTestResultById([FromRoute] int result_id)
        {
            var data = await _userService.GetTestRequestByRequestId(result_id);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy kết quả xét nghiệm" });
            }
            return Ok(data);
        }
        [HttpPut("update-Feedback")]
        public async Task<IActionResult> UpdateFeedbackByFeedbackId([FromBody] CustomerFeedbackUpdateDto model)
        {
             var data = await _userService.UpdateFeedbackByFeedbackId(model);
            return await Task.FromResult(Ok(new { message = " Cập nhật FeedBack Thành công" }));

        }
    }
}
