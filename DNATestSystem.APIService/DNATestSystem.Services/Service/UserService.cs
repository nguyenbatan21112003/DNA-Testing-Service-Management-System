using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using DNATestSystem.Application.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Hepler;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Services.Service
{
    public class UserService : IUserService
    {
        private readonly IApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public UserService(IApplicationDbContext context , IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        //Salting: đã mặn thêm muối
        public User? Login(UserLoginModel loginModel)
        {
            var user = _context.Users
                .FirstOrDefault(x => x.Email == loginModel.Email);
            if (user == null)
            {
                return null;
            }
            var password = loginModel.Password;

            if (HashHelper.BCriptVerify(password, user.Password))
            {
                return user;
            }
            return null;
        }

        public int Register(UserRegisterModel user)
        {           
            var password = user.Password;
            var hashPassword = HashHelper.BCriptHash(password);

            // Tạo user mới
            var data = new DNATestSystem.BusinessObjects.Models.User // Sử dụng Enum để xác định vai trò
            {
                FullName = user.FullName,
                Email = user.EmailAddress,
                Password = hashPassword,
                Phone = user.PhoneNumber,
                RoleId = (int)BusinessObjects.Entities.Enum.RoleNum.Customer, // Mặc định là User
                //CreateAt = DateTime.Now
            };

            _context.Users.Add(data);
            _context.SaveChanges();

            return data.UserId;
        }

        public string GenerateJwt(User user)
        {

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString()),
                new Claim(ClaimTypes.Email , user.Email),
                new Claim(ClaimTypes.Role , user.Role.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: new SigningCredentials(
                        key,
                        SecurityAlgorithms.HmacSha256Signature
                        ));
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken(int userId)
        {
            string refreshToken = HashHelper.GenerateRandomString(64);
            //refresh Token nên hash lại
            string hashRefreshToken = HashHelper.Hash256(refreshToken + userId);

            var data = new BusinessObjects.Models.RefreshToken
            {
                UserId = userId,
                Token = hashRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 ngày 
                Revoked = false
            };

            _context.RefreshTokens.Add(data);

            _context.SaveChanges();

            return hashRefreshToken;
        }

        public User GetUserByRefreshToken(string refreshToken)
        {
            var user = _context.RefreshTokens.
            Where(x => x.Token == refreshToken && (x.Revoked == false) && x.ExpiresAt > DateTime.Now)
            .Select(x => x.User)
            .FirstOrDefault();
            return user;
        }

        public void DeleteOldRefreshToken(string refreshToken)
        {
            var entity = _context.RefreshTokens
                        .FirstOrDefault(x => x.Token == refreshToken);


            if (entity != null)
            {
                return;
            }
            _context.RefreshTokens.Remove(entity);
            _context.SaveChanges();
        }

        public void DeleteOldRefreshToken(int userId)
        {
            var entity = _context.RefreshTokens
                        .Where(x => x.UserId== userId)
                        .ToList();

            if (entity != null)
            {
                return;
            }
            _context.RefreshTokens.RemoveRange(entity);
            _context.SaveChanges();
        }
        
    }
}

