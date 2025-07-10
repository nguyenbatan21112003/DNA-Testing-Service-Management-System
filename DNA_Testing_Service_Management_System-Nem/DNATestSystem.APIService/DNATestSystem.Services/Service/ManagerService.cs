using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.BlogPost;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class ManagerService : IManagerService
    {
        private readonly IApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ManagerService(IApplicationDbContext context , IHttpContextAccessor httpContextAccessor) 
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

      


    }
}
