using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "2")]
    public class StaffController : Controller
    {
        private readonly IStaffService _staffService;
        public StaffController(IStaffService staffService)
        {
            _staffService = staffService;
        }
        [HttpGet("pending-consults")]
        public async Task<IActionResult> GetPendingConsults()
        {
            var result = await _staffService.PendingTestResultsAsync();
            return Ok(result);
        }

    }
}
