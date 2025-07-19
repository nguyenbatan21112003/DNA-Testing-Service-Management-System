using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.BlogPost;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Interface
{
    public interface IManagerService
    {
        Task<bool> VerifyTestResultAsync(VertifyTestResult dto);

        Task<List<PendingTestResultDto>> GetPendingTestResultsAsync();

        Task<ApiResponseDto> AssignBolgPostsAsync(BlogPostDto dto);
        //69
        Task<List<FeedbackViewDto>> GetAllFeedbacksAsync();
        //70
        Task<List<ManagerGetTestRequestDto>> GetAllTestRequest();
        //71
        Task<List<ManagerGetTestResultDto>> GetAllTestResultsAsync();
        //72
        Task<List<ManagerGetTestSampleDto>> GetAllManagerTestSample();
        //
        Task<bool> UpdateTestResultByTestResultId(ManagerUpdateTestResultDto model);
        //
        Task<List<BlogPost>> GetAllBlogPostsAsync();
    }
}
