using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
namespace DNATestSystem.Services.Interface
{
    public interface IUserService
    {
        //Sử dụng task
        //Task<IServiceResult>
        // chỉnh sửa Task<IServiceResult>

        int Register(UserRegisterModel user);
        User? Login(UserLoginModel user);
        string GenerateJwt(User user);
        string GenerateRefreshToken(int userId);
        User GetUserByRefreshToken(string refreshToken);
        public void DeleteOldRefreshToken(string refreshToken);
        public void DeleteOldRefreshToken(int userId);
    }
}
