using Microsoft.AspNetCore.Mvc;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Entites;
using DNATestSystem.Application.Dtos;
namespace DNATestSystem.Services.Service
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
        User GetUserByRefreshToken(String refreshToken);
        public void DeleteOldRefreshToken(string refreshToken);
        public void DeleteOldRefreshToken(int userId);
    }
}
