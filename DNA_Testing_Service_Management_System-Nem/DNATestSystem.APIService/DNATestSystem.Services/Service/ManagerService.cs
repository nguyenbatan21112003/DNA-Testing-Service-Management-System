using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.BlogPost;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X509;

namespace DNATestSystem.Services.Service
{
    public class ManagerService : IManagerService
    {
        private readonly IApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ManagerService(IApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        //public List<PendingTestResultDto> GetPendingTestResults()
        //{
        //    var pendingResults = _context.TestResults
        //        .Include(tr => tr.Request)
        //            .ThenInclude(r => r.User)
        //        .Include(tr => tr.Request)
        //            .ThenInclude(r => r.Service)
        //        .Include(tr => tr.EnteredByNavigation)
        //        .Where(tr => tr.Status == "Pending")
        //        .Select(tr => new PendingTestResultDto
        //        {
        //            ResultID = tr.ResultId,
        //            RequestID = tr.RequestId,
        //            CustomerName = tr.Request != null ? tr.Request.User.FullName : null,
        //            ServiceName = tr.Request != null ? tr.Request.Service.ServiceName : null,
        //            EnteredBy = tr.EnteredByNavigation != null ? tr.EnteredByNavigation.FullName : null,
        //            EnteredAt = tr.EnteredAt,
        //            ResultData = tr.ResultData,
        //            Status = tr.Status
        //        })
        //        .ToList();

        //    return pendingResults;
        //}
        public async Task<List<PendingTestResultDto>> GetPendingTestResultsAsync()
        {
            var pendingResults = await _context.TestResults
                .Include(tr => tr.Request)
                    .ThenInclude(r => r.User)
                .Include(tr => tr.Request)
                    .ThenInclude(r => r.Service)
                .Include(tr => tr.EnteredByNavigation)
                .Where(tr => tr.Status == "Pending")
                .Select(tr => new PendingTestResultDto
                {
                    ResultID = tr.ResultId,
                    RequestID = tr.RequestId,
                    CustomerName = tr.Request != null ? tr.Request.User.FullName : null,
                    ServiceName = tr.Request != null ? tr.Request.Service.ServiceName : null,
                    EnteredBy = tr.EnteredByNavigation != null ? tr.EnteredByNavigation.FullName : null,
                    EnteredAt = tr.EnteredAt,
                    ResultData = tr.ResultData,
                    Status = tr.Status
                })
                .ToListAsync();

            return pendingResults;
        }

        //public bool VerifyTestResult(VertifyTestResult dto)
        //{
        //    var result = _context.TestResults
        //        .FirstOrDefault(tr => tr.ResultId == dto.ResultID && tr.Status == "Pending" && tr.VerifiedBy == null && tr.VerifiedAt == null);

        //    if (result == null)
        //        return false;

        //    result.Status = "Verified";
        //    result.VerifiedBy = dto.ManagerID;
        //    result.VerifiedAt = DateTime.Now;

        //    _context.SaveChanges();
        //    return true;
        //}
        public async Task<bool> VerifyTestResultAsync(VertifyTestResult dto)
        {
            var result = await _context.TestResults
                .FirstOrDefaultAsync(tr =>
                    tr.ResultId == dto.ResultID &&
                    tr.Status == "Pending" &&
                    tr.VerifiedBy == null &&
                    tr.VerifiedAt == null);

            if (result == null)
                return false;

            result.Status = "Verified";
            result.VerifiedBy = dto.ManagerID;
            result.VerifiedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ApiResponseDto> AssignBolgPostsAsync(BlogPostDto dto)
        {
            if (await _context.BlogPosts.AnyAsync(p => p.Slug == dto.Slug))
            {
                return new ApiResponseDto
                {
                    Success = false,
                    Message = "Slug đã tồn tại. Vui lòng chọn slug khác."
                };
            }

            var data = new BlogPost
            {
                Title = dto.Title,
                Slug = dto.Slug,
                Summary = dto.Summary,
                Content = dto.Content,
                AuthorId = dto.AuthorId,
                IsPublished = dto.IsPublished,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                ThumbnailUrl = dto.ThumbnailUrl
            };
            _context.BlogPosts.Add(data);
            await _context.SaveChangesAsync();
            return new ApiResponseDto
            {
                Success = true,
                Message = "Đăng bài viết thành công",
            };
        }
        public async Task<string?> GetThumbnailBySlugAsync(string slug)
        {
            var post = await _context.BlogPosts
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (post == null || string.IsNullOrWhiteSpace(post.ThumbnailUrl))
                return null;

            return post.ThumbnailUrl;
        }

        public async Task<List<FeedbackViewDto>> GetAllFeedbacksAsync()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.User)
                .Include(f => f.Result)
                .Select(f => new FeedbackViewDto
                {
                    FeedbackId = f.FeedbackId,
                    ResultId = f.ResultId ?? 0,
                    UserId = f.UserId ?? 0,
                    UserFullName = f.User!.FullName,
                    Rating = f.Rating ?? 0,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt,
                    ResultStatus = f.Result!.Status,
                    ResultFile = f.Result.ResultData
                })
                .ToListAsync();

            return feedbacks;
        }

        public async Task<List<ManagerGetTestRequestDto>> GetAllTestRequest()
        {
            var testRequests = await _context.TestRequests
                .Include(tr => tr.User)
                .Include(tr => tr.Service)
                .Select(tr => new ManagerGetTestRequestDto
                {
                    RequestId = tr.RequestId,
                    UserId = tr.UserId,
                    ServiceId = tr.ServiceId,
                    TypeId = tr.TypeId,
                    Category = tr.Category,
                    Status = tr.Status,
                    CreatedAt = tr.CreatedAt
                })
                .ToListAsync();
            return testRequests;
        }
        public async Task<List<ManagerGetTestResultDto>> GetAllTestResultsAsync()
        {
            var testResults = await _context.TestResults
                .Select(tr => new ManagerGetTestResultDto
                {
                    ResultId = tr.ResultId,
                    RequestId = tr.RequestId,
                    EnteredBy = tr.EnteredBy,
                    VerifiedBy = tr.VerifiedBy,
                    VerifiedAt = tr.VerifiedAt,
                    Status = tr.Status,
                    EnteredAt = tr.EnteredAt,
                    ResultData = tr.ResultData
                })
                .ToListAsync();
            return testResults;
        }
        public async Task<List<ManagerGetTestSampleDto>> GetAllManagerTestSample()
        {
            var testSamples = await _context.TestSamples
                .Include(ts => ts.Request)

                .Select(ts => new ManagerGetTestSampleDto
                {
                    SampleId = ts.SampleId,
                    RequestId = ts.RequestId,
                    OwnerName = ts.OwnerName,
                    Gender = ts.Gender,
                    SampleType = ts.SampleType,
                    CollectedAt = ts.CollectedAt,
                    Relationship = ts.Relationship,
                    Yob = ts.Yob
                })
                .ToListAsync();
            return testSamples;
        }
        public async Task<bool> UpdateTestResultByTestResultId(ManagerUpdateTestResultDto model)
        {
            var testResult = await _context.TestResults
                .FirstOrDefaultAsync(tr => tr.ResultId == model.ResultId);
            if (testResult == null)
            {
                return false;
            }
            // Cập nhật trạng thái và thông tin khác nếu cần
            testResult.Status = model.Status; // Ví dụ: cập nhật trạng thái thành "Updated"
            await _context.SaveChangesAsync();
            return true; // Cập nhật thành công
        }
        public async Task<List<BlogPost>> GetAllBlogPostsAsync()
        {
            var blogPosts = await _context.BlogPosts
                .Select(bp => new BlogPost
                {
                    PostId = bp.PostId,
                    Title = bp.Title,
                    Slug = bp.Slug,
                    Summary = bp.Summary,
                    Content = bp.Content,
                    AuthorId = bp.AuthorId,
                    IsPublished = bp.IsPublished,
                    CreatedAt = bp.CreatedAt,
                    UpdatedAt = bp.UpdatedAt,
                    ThumbnailUrl = bp.ThumbnailUrl
                })
                .ToListAsync();
            return blogPosts;
        }
        public async Task<List<ManagerTestProcessDto>> GetAllTestProcess()
        {
            var testProcesses = await _context.TestProcesses
                .Select(tp => new ManagerTestProcessDto
                {
                    ProcessId = tp.ProcessId,
                    RequestId = tp.RequestId,
                    StaffId = tp.StaffId,
                    KitCode = tp.KitCode,
                    ClaimtAt = tp.ClaimedAt,
                    CurrentStatus = tp.CurrentStatus,
                    Notes = tp.Notes,
                    UpdatedAt = tp.UpdatedAt
                })
                .ToListAsync();
            return testProcesses;
        }
        public async Task<bool> UpdateTestProcess(ManagerUpdateTestProcessDto model)
        {
            var testProcess = await _context.TestProcesses
                .FirstOrDefaultAsync(tp => tp.RequestId == model.RequestId);
            if (testProcess == null)
            {
                return false; // Không tìm thấy Test Process
            }
            // Cập nhật thông tin Test Process
            testProcess.CurrentStatus = model.CurrentStatus;
            testProcess.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return true; // Cập nhật thành công
        }
        public async Task<bool> UpdateBlogPostByPostId(ManagerUpdateBlogPost model)
        {
            var blogPost = await _context.BlogPosts
    .FirstOrDefaultAsync(bp => bp.PostId == model.BlogId);
            if (blogPost == null)
            {
                return false; // Không tìm thấy bài viết
            }
            // Cập nhật thông tin bài viết
            blogPost.Title = model.Title;
            blogPost.Slug = model.Slug;
            blogPost.Summary = model.Summary;
            blogPost.Content = model.Content;
            blogPost.IsPublished = model.IsPublished ?? blogPost.IsPublished;
            blogPost.UpdatedAt = model.UpdatedAt ?? DateTime.Now;
            blogPost.ThumbnailUrl = model.ThumbnailUrl;
            await _context.SaveChangesAsync();
            return true; // Cập nhật thành công
        }
    }
}
