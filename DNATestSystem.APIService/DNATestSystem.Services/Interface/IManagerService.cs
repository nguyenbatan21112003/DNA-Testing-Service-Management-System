using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.BlogPost;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Interface
{
    public interface IManagerService
    {
        Task<bool> VerifyTestResultAsync(VertifyTestResult dto);

        Task<List<PendingTestResultDto>> GetPendingTestResultsAsync();

        Task<ApiResponseDto> AssignBolgPostsAsync(BlogPostDto dto);
    }
}
