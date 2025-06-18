using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Hepler;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Services.Interface;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using Microsoft.EntityFrameworkCore;

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
                Status = (int)BusinessObjects.Entities.Enum.StatusNum.Pending
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
               new Claim(ClaimTypes.Role , user.RoleId?.ToString() ?? "0")
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

        public List<ServiceSummaryDto> GetServiceForUser()
        {
            var services = _context.Services
                            .Include(s => s.PriceDetails)
                            .AsEnumerable() // để tránh lỗi ?. không hỗ trợ trong Expression Tree
                            .Where(x => x.IsPublished == true)
                            .Select(s => new ServiceSummaryDto
                            {
                                Id = s.ServiceId,
                                Slug = s.Slug,
                                ServiceName = s.ServiceName,
                                Description = s.Description,
                                Category = s.Category,
                                IsUrgent = s.IsUrgent, 
                                IncludeVAT = true,
                                Price2Samples = s.PriceDetails.FirstOrDefault()?.Price2Samples,
                                Price3Samples = s.PriceDetails.FirstOrDefault()?.Price3Samples,
                                TimeToResult = s.PriceDetails.FirstOrDefault()?.TimeToResult
                            }) .ToList();
            return services;              
        }

        public ServiceSummaryDetailsModel GetServiceById(int id)
        {
            var service = _context.Services
                .FirstOrDefault(s => s.ServiceId == id);

            if (service == null) return null;

            var priceDetail = service.PriceDetails.FirstOrDefault();

            return new ServiceSummaryDetailsModel
            {
                Id = service.ServiceId,
                Slug = service.Slug,
                ServiceName = service.ServiceName,
                Category = service.Category,
                Description = service.Description,
                IsUrgent = false, // hoặc true nếu bạn có trường này
                IncludeVAT = true,
                Price2Samples = priceDetail?.Price2Samples,
                Price3Samples = priceDetail?.Price3Samples,
                TimeToResult = priceDetail?.TimeToResult,
                CreatedAt = service.CreatedAt
            };
        }

        public List<BlogPostModel> GetAllBlogForUser()
        {
            var blogPosts = _context.BlogPosts
                 .Include(p => p.Author)
                 .Where(p => (bool)p.IsPublished == true)
                 .Select(p => new BlogPostModel
                 {
                     PostId = p.PostId,
                     Title = p.Title,
                     Slug = p.Slug,
                     Summary = p.Summary,
                     ThumbnailURL = p.ThumbnailURL,
                     AuthorName = p.Author.FullName
                 })
                 .ToList();
            return blogPosts;
            }

        public BlogPostDetailsModel GetBlogPostDetailsModel(string Slug)
        {
            var blog = _context.BlogPosts
                .Where(s => s.IsPublished == true)
               .FirstOrDefault(s => s.Slug == Slug);

            if (blog == null) return null;


            return new BlogPostDetailsModel
            {
               PostId = blog.PostId,
               Title = blog.Title,  
               Slug = blog.Slug,    
               Summary = blog.Summary,  
               ThumbnailURL = blog.ThumbnailURL,    
               Content = blog.Content,
               CreatedAt = blog.CreatedAt,
               UpdatedAt = blog.UpdatedAt,
               IsPublished = blog.IsPublished,
               AuthorId = blog.AuthorId,
            };
        }

        public ProfileDetailModel? GetProfileUser(int Profile_Id)
        {
            var data = _context.Users
                        .Include(x => x.UserProfiles)
                        .FirstOrDefault(x => x.UserId == Profile_Id);

            if (data == null)
                return null;

            var profile = data.UserProfiles.FirstOrDefault();

            return new ProfileDetailModel
            {
                UserID = data.UserId,
                FullName = data.FullName,
                PhoneNumber = data.Phone,
                Email = data.Email,
                RoleID = data.RoleId,
                CreatedAt = data.CreatedAt,
                ProfileDto = profile == null ? null : new ProfileDto
                {
                    Gender = profile.Gender,
                    Address = profile.Address,
                    DateOfBirth = profile.DateOfBirth,
                    IdentityFile = profile.IdentityFile,
                    Fingerfile = profile.Fingerfile,
                    UpdatedAt = profile.UpdatedAt,
                }
            };
        }

    }
}

