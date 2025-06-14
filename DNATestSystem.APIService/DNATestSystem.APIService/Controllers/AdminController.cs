using DNATestSystem.APIService.ActionFilter;
using DNATestSystem.Application.Dtos;
using DNATestSystem.BusinessObjects.Entities.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [TypeFilter(typeof(AuthorizationFilter), Arguments = [$"{nameof(RoleNum.Admin)}"])]
    [Authorize(Roles = "Admin")]
    public class AdminController
    {
            
    }
}
