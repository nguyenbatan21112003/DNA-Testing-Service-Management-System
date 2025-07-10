using System.Security.Claims;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
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

    }
}
