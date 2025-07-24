using System.Security.Claims;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using DNATestSystem.Services.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "2")]
    public class StaffController : Controller
    {
        private readonly IStaffService _staffService;
        private readonly IApplicationDbContext _context;

        public StaffController(IStaffService staffService, IApplicationDbContext context)
        {
            _staffService = staffService;
            _context = context;

        }
        //private int GetCurrentUserId()
        //{
        //    var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        //}
        [HttpGet("pending-consults")]
        public async Task<IActionResult> GetPendingConsults()
        {
            var result = await _staffService.PendingConsultResultsAsync();
            return Ok(result);
        }

        [HttpPut("consults/complete")]
        public async Task<IActionResult> CompleteConsult([FromBody] UpdateConsultRequestDto model)
        {
            var result = await _staffService.UpdateConsultResultAsync(model);
            if (!result) return NotFound("Không tìm thấy yêu cầu tư vấn.");

            return Ok("Cập nhật thành công.");
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingTestRequests()
        {
            var result = await _staffService.PendingTestRequestAsync();
            return Ok(result);
        }
        [HttpGet("at-center")]
        public async Task<IActionResult> GetAtCenterTestRequests()
        {
            var result = await _staffService.AtCenterTestRequestAsync();
            return Ok(result);
        }
        [HttpGet("at-home")]
        public async Task<IActionResult> GetAtHomeTestRequests()
        {
            var result = await _staffService.AtHomeTestRequestAsync();
            return Ok(result);
        }
        //[HttpGet("at-center-administrative")]
        //public async Task<IActionResult> GetAtCenterAdministrativeRequests([FromQuery] int staffId)
        //{
        //    var result = await _staffService.GetAtCenterAdministrativeRequestsAsync();
        //    return Ok(result);
        //}
        [HttpGet("at-center-administrative")]
        public async Task<IActionResult> GetAtCenterAdministrativeRequests()
        {
            var result = await _staffService.GetAtCenterAdministrativeRequestsAsync();
            return Ok(result);
        }//2 thằng dưới đây sẽ ko truyền vào một staffId nữa , vì do đã làm ở trong StaffService

        //[HttpGet("test-processes/{staffId}")]
        //public async Task<IActionResult> GetTestProcessesByStaffId(int staffId)
        //{
        //    var result = await _staffService.GetTestProcessesByStaffIdAsync();
        //    return Ok(result);
        //}
        [HttpGet("test-processes")]
        public async Task<IActionResult> GetTestProcessesByStaffId()
        {
            var result = await _staffService.GetTestProcessesByStaffIdAsync();
            return Ok(result);
        }

        //[HttpGet("samples")]
        //public async Task<IActionResult> GetSamplesByRequest([FromQuery] int requestId)
        //{
        //    var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //    if (!int.TryParse(staffIdClaim, out var staffId))
        //    {
        //        return Unauthorized("Invalid staff identity");
        //    }

        //    var result = await _staffService.GetSamplesByStaffAndRequestAsync(staffId, requestId);
        //    return Ok(result);
        //}
        [HttpGet("samples")]
        public async Task<IActionResult> GetSamplesByRequest([FromQuery] int requestId)
        {
            var result = await _staffService.GetSamplesByRequestAsync(requestId);
            return Ok(result);
        }

        [HttpPost("post-SampleCollection")]
        public async Task<IActionResult> Post([FromBody] SampleCollectionFormsSummaryDto request)
        {
            var success = await _staffService.CreateSampleCollectionsAsync(request);
            if (!success)
                return NotFound("TestProcess not found or invalid");

            return Ok(new
            {
                success = true,
                message = "Sample collection saved successfully"
            });
        }
        //[HttpPut("mark-sample-received")]
        //public async Task<IActionResult> MarkSampleReceived([FromBody] UpdateTestProcessModel model)
        //{
        //    var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //    if (!int.TryParse(staffIdClaim, out var staffId))
        //        return Unauthorized("Invalid staff identity");

        //    model.StaffId = staffId; // gán vào model

        //    var result = await _staffService.MarkTestProcessSampleReceivedAsync(model);

        //    if (!result)
        //        return NotFound("Không tìm thấy TestProcess phù hợp với staff hiện tại.");

        //    return Ok(new
        //    {
        //        success = true,
        //        message = "Cập nhật trạng thái thành công."
        //    });
        //}

        [HttpPut("mark-sample-received")]
        public async Task<IActionResult> MarkSampleReceived([FromBody] UpdateTestProcessModel model)
        {
            var result = await _staffService.MarkTestProcessSampleReceivedAsync(model);

            if (!result)
                return NotFound("Không tìm thấy TestProcess phù hợp hoặc bạn không có quyền.");

            return Ok(new
            {
                success = true,
                message = "Cập nhật trạng thái thành công."
            });
        }
        [HttpPut("samples/update-by-request")]
        public async Task<IActionResult> UpdateSamplesByRequest([FromBody] UpdateTestSampleDto dto)
        {
            var result = await _staffService.UpdateTestSamplesByRequestAsync(dto);

            if (!result)
                return NotFound("Không tìm thấy mẫu hoặc bạn không có quyền.");

            return Ok(new { success = true, message = "Cập nhật mẫu thành công." });
        }

        [HttpPost("assign-test-process")]
        public async Task<IActionResult> AssignTestProcess([FromBody] AssignTestProcessDto dto)
        {
            var result = await _staffService.AssignTestProcessAsync(dto);
            return result.Success ? Ok(result) : StatusCode(500, result);
        }
        [HttpGet("get-staff-feedback")]
        public async Task<IActionResult> GetMyFeedbacks()
        {
            var staffId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _staffService.GetFeedbacksByStaffIdAsync(staffId);
            return Ok(new { success = true, data = result });
        }
        [HttpPut("update-status/{requestId}")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateTestRequestModel model)
        {
            try
            {
                var result = await _staffService.UpdateTestRequestStatusAsync(model);
                return Ok(new { success = result, message = "Cập nhật trạng thái thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpPost("test-results/create")]
        public async Task<IActionResult> CreateTestResult([FromBody] CreateTestResultDto dto)
        {
            try
            {
                var success = await _staffService.CreateTestResultByStaffAsync(dto);
                return Ok(new { success, message = "Tạo kết quả xét nghiệm thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        //48
        [HttpPost("sample-collections")]
        public async Task<IActionResult> GetSampleCollectionForms([FromBody] GetSampleCollectionFormsModel model)
        {
            var data = await _staffService.GetSampleCollectionsByStaffIdAsync(model);
            if (data == null)
                return NotFound(new { message = "Không tìm thấy thông tin thu mẫu cho processId này." });

            return Ok(data);
        }
        [HttpGet("test-results/{test_requestId}")]
        public async Task<IActionResult> GetTestResultByTestRequestId(int test_requestId)
        {
            var data = await _staffService.GetTestResultsByTestRequestIdAsync(test_requestId);
            if (data == null || !data.Any())
            {
                return NotFound(new { message = "Không tìm thấy kết quả xét nghiệm cho yêu cầu này." });
            }
            return Ok(data);
        }
        [HttpGet("feedback/{test_requestId}")]
        public async Task<IActionResult> GetFeedbackByTestRequestId(int test_requestId)
        {
            var data = await _staffService.GetFeedbackByTestRequestIdAsync(test_requestId);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy phản hồi cho yêu cầu xét nghiệm này." });
            }
            return Ok(data);
        }
        [HttpPut("update-test-process")]
        public async Task<IActionResult> UpdateKitCodeByTestProcessId([FromBody] UpdateKitCodeByTestProcess dto)
        {
            try
            {
                var result = await _staffService.UpdateKitCodeByTestProcessIdAsync(dto);
                return Ok(new { success = result, message = "Cập nhật mã kit thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [HttpPut("update-multiple-test-sample")]
        public async Task<IActionResult> UpdateMultipleSamples([FromBody] List<UpdatedTestSampleDto> dtos)
        {
            if (dtos == null || !dtos.Any())
                return BadRequest(new { success = false, message = "Dữ liệu gửi lên không hợp lệ." });

            try
            {
                var updated = await _staffService.UpdateTesSampleByTestRequestAndSampleId(dtos);
                return Ok(new { success = true, message = "Cập nhật mẫu thành công.", data = updated });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpGet("SampleTest-fingleFile")]
        public async Task<IActionResult> GetSampleCollectionByCustomerAsync([FromQuery] int processId)
        {
            var data = await _staffService.GetFingerprintImageBySlugAsync(processId);
            if (data == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin thu mẫu cho processId này." });
            }
            return Ok(data);
        
        }
    }
}
