using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entiry;
using DNATestSystem.Application.Dtos;
namespace DNATestSystem.Service
{
    public interface IUserService
    {
        //Sử dụng task
        //Task<IServiceResult>
        // chỉnh sửa Task<IServiceResult>

        int Register(UserRegisterModel user);
        User? Login(UserLoginModel user);
        string GenerateJwt(User user);
        bool VerifyCurrentPassword(string email, string currentPassword);
        bool ConfirmOtp(string email, string otp);
        void RequestPasswordChange(string email, string newPassword);
        void ChangePassword(string email, string newPassword);
    }
}
