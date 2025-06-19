using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
namespace DNATestSystem.Services.Interface
{
    public interface  IUserService
    {
        //Sử dụng task
        //Task<IServiceResult>
        // chỉnh sửa Task<IServiceResult>

        int Register(UserRegisterModel user);
        User? Login(UserLoginModel user);
        string GenerateJwt(User user);
        string GenerateRefreshToken(int userId);
        User GetUserByRefreshToken(string refreshToken);
        void DeleteOldRefreshToken(string refreshToken);
        void DeleteOldRefreshToken(int userId);
        List<ServiceSummaryDto> GetServiceForUser();
        ServiceSummaryDetailsModel  GetServiceById(int id);

        List<BlogPostModel> GetAllBlogForUser();
        BlogPostDetailsModel GetBlogPostDetailsModel(string Slug);
        //UserProfile
        ProfileDetailModel GetProfileUser(int Profile_Id);
        UpdateProfileModel UpdateProfile(UpdateProfileModel updateProfileModel);
    }
}
