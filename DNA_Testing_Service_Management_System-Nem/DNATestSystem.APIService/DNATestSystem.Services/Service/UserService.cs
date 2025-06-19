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
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        //public User? Login(UserLoginModel loginModel)
        //{
        //    var user = _context.Users
        //        .FirstOrDefault(x => x.Email == loginModel.Email);
        //    if (user == null)
        //    {
        //        return null;
        //    }
        //    var password = loginModel.Password;

        //    if (HashHelper.BCriptVerify(password, user.Password))
        //    {
        //        return user;
        //    }
        //    return null;
        //}

        public async Task<User?> LoginAsync(UserLoginModel loginModel)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == loginModel.Email);

            if (user == null) return null;

            var password = loginModel.Password;

            return HashHelper.BCriptVerify(password, user.Password) ? user : null;
        }

        public async Task<int> RegisterAsync(UserRegisterModel user)
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
            await _context.SaveChangesAsync();

            return data.UserId;
        }

        public Task<string> GenerateJwtAsync(User user)
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
            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }

        public async Task<string> GenerateRefreshTokenAsync(int userId)
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

            await _context.SaveChangesAsync();

            return hashRefreshToken;
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken)
        {
             var user = await _context.RefreshTokens.
            Where(x => x.Token == refreshToken && (x.Revoked == false) && x.ExpiresAt > DateTime.Now)
            .Select(x => x.User)
            .FirstOrDefaultAsync();
            return user;
        }

        public async Task DeleteOldRefreshToken(string refreshToken)
        {
            var entity = await _context.RefreshTokens
                        .FirstOrDefaultAsync(x => x.Token == refreshToken);
            if (entity != null)
            {
                return;
            }
            _context.RefreshTokens.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOldRefreshTokenAsync(int userId)
        {
            var entity = await _context.RefreshTokens
                        .Where(x => x.UserId== userId)
                        .ToListAsync();

            if (entity != null)
            {
                return;
            }
            _context.RefreshTokens.RemoveRange(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ServiceSummaryDto>> GetServiceForUserAsync()
        {
            var priceDetails = await _context.Services
                                    .Include(s => s.PriceDetails)
                                    .Where(s => s.IsPublished == true)
                                    .ToListAsync();
            //tạo ra priceDetails khi đã join với Service
            var service = priceDetails
                            .Select(s => 
                            {
                                var price = s.PriceDetails.FirstOrDefault();
                                //lấy tk Price ra

                                return new ServiceSummaryDto
                                {
                                    Id = s.ServiceId,
                                    Slug = s.Slug,
                                    ServiceName = s.ServiceName,
                                    Description = s.Description,
                                    Category = s.Category,
                                    IsUrgent = s.IsUrgent,
                                    IncludeVAT = true,
                                    Price2Samples = price?.Price2Samples,
                                    Price3Samples = price?.Price3Samples,
                                    TimeToResult = price?.TimeToResult
                                };
                            }).ToList();
            return service;                 
        }

        public async Task<ProfileDetailModel?> GetProfileUserAsync(int profileId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(s => s.UserId == profileId);

            if (user == null) return null;

            var profile = user.UserProfiles.FirstOrDefault();

            return new ProfileDetailModel
            {
                UserID = user.UserId,
                FullName = user.FullName,
                PhoneNumber = user.Phone,
                Email = user.Email,
                RoleID = user.RoleId,
                CreatedAt = user.CreatedAt,
                ProfileDto = profile == null ? null : new ProfileDto
                {
                    Gender = profile.Gender,
                    Address = profile.Address,
                    DateOfBirth = profile.DateOfBirth,
                    IdentityFile = profile.IdentityFile,
                    Fingerfile = profile.Fingerfile,
                    UpdatedAt = profile.UpdatedAt
                }
            };
        }

        public async Task<List<BlogPostModel>> GetAllBlogForUserAsync()
        {
            var blogPosts = await _context.BlogPosts
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
                 .ToListAsync();
            return blogPosts;
            }

        public async Task<BlogPostDetailsModel?> GetBlogPostDetailsModelAsync(string slug)
        {
            var blog = await _context.BlogPosts
                .Where(s => s.IsPublished == true)
               .FirstOrDefaultAsync(s => s.Slug == slug);

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

        public async Task<UpdateProfileModel?> UpdateProfileAsync(UpdateProfileModel updateProfileModel)
        {
            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.ProfileId == updateProfileModel.ProfileId);

            if(userProfile == null)
            {
                return null;
            }
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserId == userProfile.UserId);
            var data = new UpdateProfileModel
            {
                Fullname = user.FullName,
                Phone = user.Phone,

                Gender = userProfile.Gender,
                Address = userProfile.Address,
                DateOfBirth = userProfile.DateOfBirth,
                IdentityFile = userProfile.IdentityFile,
                Fingerfile = userProfile.Fingerfile,
            };
            return data;
        }

        public async Task DeleteOldRefreshTokenAsync(string refreshToken)
        {
            var entity = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == refreshToken);
            if (entity != null)
            {
                _context.RefreshTokens.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<ServiceSummaryDetailsModel?> GetServiceByIdAsync(int id)
        {
            var service = await _context.Services.Include(s => s.PriceDetails).FirstOrDefaultAsync(s => s.ServiceId == id);
            if (service == null) return null;

            var priceDetail = service.PriceDetails.FirstOrDefault();

            return new ServiceSummaryDetailsModel
            {
                Id = service.ServiceId,
                Slug = service.Slug,
                ServiceName = service.ServiceName,
                Category = service.Category,
                Description = service.Description,
                IsUrgent = false,
                IncludeVAT = true,
                Price2Samples = priceDetail?.Price2Samples,
                Price3Samples = priceDetail?.Price3Samples,
                TimeToResult = priceDetail?.TimeToResult,
                CreatedAt = service.CreatedAt
            };
        }
    }
}

