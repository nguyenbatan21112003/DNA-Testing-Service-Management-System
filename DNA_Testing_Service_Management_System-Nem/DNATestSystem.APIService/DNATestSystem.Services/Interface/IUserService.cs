using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;


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

        // Dịch vụ
        Task<List<ServiceSummaryDto>> GetServiceForUserAsync();
        Task<ServiceSummaryDetailsModel?> GetServiceByIdAsync(int id);

        // Blog
        Task<List<BlogPostModel>> GetAllBlogForUserAsync();
        Task<BlogPostDetailsModel?> GetBlogPostDetailsModelAsync(string slug);

        // Hồ sơ cá nhân
        Task<ProfileDetailModel?> GetProfileUserAsync(int profileId);
        Task<UpdateProfileModel> UpdateProfileAsync(UpdateProfileModel updateProfileModel);
    }
}
