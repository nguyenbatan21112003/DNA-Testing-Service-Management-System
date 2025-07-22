using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using System.Runtime.CompilerServices;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.UserProfile;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;


namespace DNATestSystem.Services.Interface
{
    public interface IUserService
    {
        //Sử dụng task
        //Task<IServiceResult>
        // chỉnh sửa Task<IServiceResult>

        // Tài khoản
        Task<int> RegisterAsync(UserRegisterModel user);
        Task<User?> LoginAsync(UserLoginModel user);
        Task<string> GenerateJwtAsync(User user);
        Task<string> GenerateRefreshTokenAsync(int userId);
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
        Task DeleteOldRefreshTokenAsync(string refreshToken);
        Task DeleteOldRefreshTokenAsync(int userId);
        //flow doi mat khau
        Task<bool> VerifyCurrentPasswordAsync(UserVerifyCurrentPassword model);
        Task ChangePasswordAsync(UserChangePasswordModel model);
        // Dịch vụ
        Task<List<ServiceSummaryDto>> GetServiceForUserAsync();
        Task<ServiceSummaryDetailsModel?> GetServiceByIdAsync(int id);
        Task<ProfileViewDto> GetUserProfileByEmail(string email);
        // Blog
        Task<List<BlogPostModel>> GetAllBlogForUserAsync();
        Task<BlogPostDetailsModel?> GetBlogPostDetailsModelAsync(string slug);
        // Hồ sơ cá nhân
        Task<ProfileDetailModel?> GetProfileUserAsync(int profileId);
        Task<UpdateProfileModel> UpdateProfileAsync(UpdateProfileModel updateProfileModel);
        //đăng ký tư vấn
        Task<ConsultRequest> SendConsultRequestAsync(SendConsultRequestModel model);
        Task<ApiResponseDtoWithReqId> SubmitTestRequestAsync(TestRequestSubmissionDto dto);
        //coi lich su 
        Task<List<TestResultHistory>> GetTestRequestHistoryAsync(int userId);
        Task<ApiResponseDto> GetVerifiedTestResult(TestResultVerifyDto dto);
        //
        Task<bool> CreateFeedBack(FeedBackDto feedBackDto);
        //
        Task<bool> CreateUserProfile(UserProfileDto userProfileDto);

        //Task<bool> CreateSampleCollectionsAsync(SampleCollectionFormsSummaryDto request);

        //customer
        Task<SampleCollectionFormsSummaryDto?> GetSampleCollectionByCustomerAsync(int processId);
        Task<List<RequestDto>> GetTestRequestsByCustomerIdAsync();
        //63
        Task<GetTestProcessDto> GetTestProcessByTestRequestAsync(int test_requestId);
        //64
        Task<GetDeclarantDto> GetRequestDeclarantsByTestRequestIdAsync(int test_requestId); 
        //65
        Task<List<GetTestSampleDto>> GetSampleProvidersByTestRequestIdAsync(int test_requestId);
        //66
        Task<List<CustomerFeedbackDto>> GetFeedbackByCustomerIdAsync();
        //
        Task<List<GetTestResultDto>> GetTestRequestByRequestId(int request_id);
    }
}
