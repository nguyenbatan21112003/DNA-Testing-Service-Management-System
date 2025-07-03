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
        public ManagerController(IManagerService managerService)
        {
            _managerService = managerService;
        }
        [HttpGet("test-results/pending")]
        public IActionResult GetPendingTestResults()
        {
            var results = _managerService.GetPendingTestResults();
            return Ok(results);
        }
        [HttpPut("verify")]
        public IActionResult VerifyTestResult([FromBody] VertifyTestResult dto)
        {
            var success = _managerService.VerifyTestResult(dto);
            return success ? Ok("Verified successfully.") : NotFound("TestResult not found or already verified.");
        }

    }
}
