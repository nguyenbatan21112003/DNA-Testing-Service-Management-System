using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
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
        [HttpPost("assign-test-process")]
        public async Task<IActionResult> AssignTestProcess([FromBody] AssignTestProcessDto dto)
        {
            var result = await _staffService.AssignTestProcessAsync(dto);

            if (result.Success)
                return Ok(new { success = true, message = result.Message });

            return StatusCode(500, new { success = false, error = result.Message });
        }
        [HttpGet("at-center-administrative")]
        public async Task<IActionResult> GetAtCenterAdministrativeRequests([FromQuery] int staffId)
        {
            var result = await _staffService.GetAtCenterAdministrativeRequestsAsync(staffId);
            return Ok(result);
        }
        [HttpGet("staff/{staffId}")]
        public async Task<IActionResult> GetByStaffId(int staffId)
        {
            var result = await _staffService.GetTestProcessesByStaffIdAsync(staffId);
            if (result == null || !result.Any())
            {
                return NotFound("No test processes found.");
            }

            return Ok(result);
        }
    }
}
