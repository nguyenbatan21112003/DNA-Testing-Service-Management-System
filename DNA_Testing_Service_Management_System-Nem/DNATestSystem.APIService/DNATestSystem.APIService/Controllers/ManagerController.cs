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
        [HttpGet("test-results/pending")]
        public IActionResult GetPendingTestResults()
        {
            var results = _managerService.GetPendingTestResults();
            return Ok(results);
        }

    }
}
