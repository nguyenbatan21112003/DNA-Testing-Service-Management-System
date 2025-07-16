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
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using Microsoft.AspNetCore.Http;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.UserProfile;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;

namespace DNATestSystem.Services.Service
{
    public class UserService : IUserService
    {
        private readonly IApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IApplicationDbContext context, IOptions<JwtSettings> jwtSettings
                           , IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
            _httpContextAccessor = httpContextAccessor;
        }
        private int GetCurrentUserId()
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
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

            if (user.Status == -1) return null;

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
                Status = (int)BusinessObjects.Entities.Enum.StatusNum.Pending,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(data);
            await _context.SaveChangesAsync();
            // Tạo user profile mặc định sau khi tạo user
            var profile = new UserProfile
            {
                UserId = data.UserId,
                Gender = "",
                Address = "",
                DateOfBirth = null,
                IdentityId = "",
                Fingerfile = "",
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserProfiles.Add(profile);
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
                expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpirationInHours),
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

        public async Task DeleteOldRefreshTokenAsync(string refreshToken)
        {
            var entity = await _context.RefreshTokens
                        .FirstOrDefaultAsync(x => x.Token == refreshToken);
            if (entity == null)
            {
                return;
            }
            _context.RefreshTokens.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOldRefreshTokenAsync(int userId)
        {
            var entity = await _context.RefreshTokens
                        .Where(x => x.UserId == userId)
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
            ////tạo ra priceDetails khi đã join với Service
            //var service = priceDetails
            //                .Select(s =>
            //                {
            //                    var price = s.PriceDetails.FirstOrDefault();
            //                    //lấy tk Price ra

            //                    return new ServiceSummaryDto
            //                    {
            //                        Id = s.ServiceId,
            //                        Slug = s.Slug,
            //                        ServiceName = s.ServiceName,
            //                        Description = s.Description,
            //                        Category = s.Category,
            //                        IsUrgent = (bool)s.IsUrgent,
            //                        IncludeVAT = true,
            //                        Price2Samples = price?.Price2Samples,
            //                        Price3Samples = price?.Price3Samples,
            //                        TimeToResult = price?.TimeToResult
            //                    };
            //                }).ToList();
            //return service;
            var service = priceDetails
                        .Select(s =>
                        {
                            var price = s.PriceDetails.FirstOrDefault(); // có thể null

                            return new ServiceSummaryDto
                            {
                                Id = s.ServiceId,
                                Slug = s.Slug,
                                ServiceName = s.ServiceName,
                                Description = s.Description,
                                Category = s.Category,
                                IsUrgent = s.IsUrgent ?? false, // null-safe
                                IncludeVAT = price?.IncludeVat ?? false,  // dùng trong PriceDetails
                                Price2Samples = price?.Price2Samples ?? 0,
                                Price3Samples = price?.Price3Samples ?? 0,
                                TimeToResult = price?.TimeToResult ?? "N/A"
                            };
                        })
                        .ToList();
            return service;
        }

        public async Task<ProfileDetailModel?> GetProfileUserAsync(int profileId)
        {
            var user = await _context.Users
                .Include(x => x.UserProfiles)
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
                    IdentityID = profile.IdentityId,
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
                     ThumbnailURL = p.ThumbnailUrl,
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
                ThumbnailURL = blog.ThumbnailUrl,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UpdatedAt = blog.UpdatedAt,
                IsPublished = blog.IsPublished,
                AuthorId = blog.AuthorId,
            };
        }

        public async Task<UpdateProfileModel?> UpdateProfileAsync(UpdateProfileModel updateProfileModel)
        {
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                throw new UnauthorizedAccessException("Không thể xác định người dùng.");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                throw new Exception("Không tìm thấy người dùng.");

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (userProfile == null)
                throw new Exception("Không tìm thấy hồ sơ người dùng.");

            // Cập nhật profile
            userProfile.Gender = updateProfileModel.Gender;
            userProfile.Address = updateProfileModel.Address;
            userProfile.DateOfBirth = updateProfileModel.DateOfBirth;
            userProfile.IdentityId = updateProfileModel.IdentityID;
            userProfile.Fingerfile = updateProfileModel.Fingerfile;

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UpdateProfileModel
            {
                Fullname = user.FullName,
                Phone = user.Phone,
                Gender = userProfile.Gender,
                Address = userProfile.Address,
                DateOfBirth = userProfile.DateOfBirth,
                IdentityID = userProfile.IdentityId,
                Fingerfile = userProfile.Fingerfile,
                ProfileId = userProfile.ProfileId
            };

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

        public async Task<bool> VerifyCurrentPasswordAsync(UserVerifyCurrentPassword model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return false;


            return HashHelper.BCriptVerify(model.CurrentPassword, user.Password);
        }

        public async Task ChangePasswordAsync(UserChangePasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null)
                throw new Exception("User not found.");

            var isMatch = BCrypt.Net.BCrypt.Verify(model.CurrentPassword, user.Password);
            if (!isMatch)
                throw new Exception("Current password is incorrect.");
            // Mã hóa mật khẩu mới
            user.Password = HashHelper.BCriptHash(model.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public Task<ConsultRequest> SendConsultRequestAsync(SendConsultRequestModel model)
        {
            var consultRequest = new ConsultRequest
            {
                FullName = model.FullName,
                Phone = model.Phone,
                Category = model.Category,
                ServiceId = model.ServiceId,
                Message = model.Message,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };
            _context.ConsultRequests.Add(consultRequest);
            _context.SaveChangesAsync();
            return Task.FromResult(consultRequest);
        }

        public async Task<ApiResponseDtoWithReqId> SubmitTestRequestAsync(TestRequestSubmissionDto dto)
        {
            using var transaction = await (_context as DbContext)!.Database.BeginTransactionAsync();
            try
            {
                int collectTypeId = dto.TestRequest.TypeId switch
                {
                    1 => 1, // At Center
                    2 => 2, // At Home
                    _ => throw new ArgumentException("Invalid TypeId")
                };
                var testRequest = new TestRequest
                {
                    UserId = dto.TestRequest.UserId,
                    ServiceId = dto.TestRequest.ServiceId,
                    TypeId = dto.TestRequest.TypeId,
                    Category = dto.TestRequest.Category,
                    ScheduleDate = dto.TestRequest.ScheduleDate,
                    Address = dto.TestRequest.Address,
                    Status = "unpaid", // luôn đặt là unpaid khi mới đăng ký
                    CreatedAt = DateTime.Now,
                    CollectID = collectTypeId
                };

                _context.TestRequests.Add(testRequest);
                await _context.SaveChangesAsync();

                var declarant = new RequestDeclarant
                {
                    RequestId = testRequest.RequestId,
                    FullName = dto.Declarant.FullName,
                    Gender = dto.Declarant.Gender,
                    Address = dto.Declarant.Address,
                    IdentityNumber = dto.Declarant.IdentityNumber,
                    IdentityIssuedDate = dto.Declarant.IdentityIssuedDate,
                    IdentityIssuedPlace = dto.Declarant.IdentityIssuedPlace,
                    Phone = dto.Declarant.Phone,
                    Email = dto.Declarant.Email
                };

                _context.RequestDeclarants.Add(declarant);

                foreach (var s in dto.Samples)
                {
                    var sample = new TestSample
                    {
                        RequestId = testRequest.RequestId,
                        OwnerName = s.OwnerName,
                        Gender = s.Gender,
                        Relationship = s.Relationship,
                        SampleType = s.SampleType,
                        Yob = s.Yob,
                        CollectedAt = DateTime.Now
                    };

                    _context.TestSamples.Add(sample);
                }

                //var invoice = new Invoice
                //{
                //    RequestId = testRequest.RequestId,
                //    PaidAt = dto.Invoice.PaidAt
                //};

                //_context.Invoices.Add(invoice);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ApiResponseDtoWithReqId
                {
                    Success = true,
                    Message = "Đăng ký xét nghiệm thành công",
                    RequestId = testRequest.RequestId
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ApiResponseDtoWithReqId
                {
                    Success = false,
                    Message = ex.InnerException?.Message ?? ex.Message,
                    RequestId = null
                };

            }
        }

        public async Task<ApiResponseDto> GetVerifiedTestResult(TestResultVerifyDto dto)
        {
            var result = await _context.TestResults
          .FirstOrDefaultAsync(r => r.ResultId == dto.ResultId);

            if (result == null)
            {
                return new ApiResponseDto
                {
                    Success = false,
                    Message = "Không tìm thấy kết quả xét nghiệm."
                };
            }

            if (result.Status == "Verified")
            {
                return new ApiResponseDto
                {
                    Success = false,
                    Message = "Kết quả này đã được xác minh trước đó."
                };
            }

            result.Status = dto.Status; // Thường là "Verified"
            result.VerifiedAt = DateTime.Now;
            result.VerifiedBy = dto.ManagerId;

            _context.TestResults.Update(result);
            await _context.SaveChangesAsync();

            return new ApiResponseDto
            {
                Success = true,
                Message = "Xác minh kết quả thành công."
            };
        }

        public async Task<List<TestResultHistory>> GetTestRequestHistoryAsync(int userId)
        {
            var result = await _context.TestRequests
               .Where(tr => tr.UserId == userId)
               .Include(tr => tr.Service)
               .Include(tr => tr.CollectType) // CollectType
               .Include(tr => tr.TestProcesses)
               .Include(tr => tr.RequestDeclarants) // đây là collection
               .Select(tr => new TestResultHistory
               {
                   Request = new RequestDto
                   {
                       RequestId = tr.RequestId,
                       ServiceId = tr.ServiceId ?? 0,
                       ServiceName = tr.Service!.ServiceName,
                       CollectType = tr.CollectType!.CollectName,
                       Category = tr.Category,
                       ScheduleDate = tr.ScheduleDate ?? DateTime.MinValue,
                       Address = tr.Address,
                       Status = tr.Status,
                       CreatedAt = tr.CreatedAt ?? DateTime.MinValue
                   },
                   TestProcess = tr.TestProcesses
                       .OrderByDescending(p => p.ProcessId)
                       .Select(p => new TestProcessHistoryDto
                       {
                           ProcessId = p.ProcessId,
                           RequestId = p.RequestId,
                           CurrentStatus = p.CurrentStatus,
                           Notes = p.Notes
                       }).FirstOrDefault(),

                   Declarant = tr.RequestDeclarants
                       .Select(d => new DeclarantDto
                       {
                           FullName = d.FullName,
                           Gender = d.Gender,
                           IdentityNumber = d.IdentityNumber,
                           IdentityIssuedDate = d.IdentityIssuedDate ?? DateTime.MinValue,
                           IdentityIssuedPlace = d.IdentityIssuedPlace,
                           Address = d.Address,
                           Phone = d.Phone,
                           Email = d.Email
                       }).FirstOrDefault() // chỉ lấy người đầu tiên
               })
               .ToListAsync();

            return result;
        }

        public async Task<bool> CreateFeedBack(FeedBackDto feedBackDto)
        {
            var resultExists = await _context.TestResults.AnyAsync(r => r.ResultId == feedBackDto.ResultId);
            var userExists = await _context.Users.AnyAsync(u => u.UserId == feedBackDto.UserId);

            if (!resultExists || !userExists)
                throw new Exception("Result hoặc User không tồn tại.");
            var feedBack = new Feedback
            {
                ResultId = feedBackDto.ResultId,
                UserId = feedBackDto.UserId,
                Rating = feedBackDto.Rating,
                Comment = feedBackDto.Comment,
                CreatedAt = DateTime.Now
            };
            _context.Feedbacks.Add(feedBack);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> CreateUserProfile(UserProfileDto userProfileDto)
        {
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                throw new UnauthorizedAccessException("Không thể xác định người dùng.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                throw new Exception("User không tồn tại.");
            }

            var profile = new UserProfile
            {
                UserId = userId,
                Gender = userProfileDto.Gender,
                Address = userProfileDto.Address,
                DateOfBirth = userProfileDto.DateOfBirth,
                IdentityId = userProfileDto.IdentityId,
                Fingerfile = userProfileDto.Fingerfile,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.UserProfiles.AddAsync(profile);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ProfileViewDto> GetUserProfileByEmail(string email)
        {
            var data = await _context.UserProfiles
                       .Include(x => x.User)
                          .Where(x => x.User.Email == email)
                       .Select(

                       x => new ProfileViewDto
                       {
                           Gender = x.Gender,
                           PhoneNumber = x.User.Phone,
                           Address = x.Address,
                           DateOfBirth = x.DateOfBirth,
                           Fingerfile = x.Fingerfile,
                           IdentityId = x.IdentityId,
                           UpdatedAt = x.UpdatedAt
                       }).FirstOrDefaultAsync();

            if (data == null)
                throw new Exception("User profile not found");
            return data;
        }

        // Truy xuất thông tin thu mẫu dựa trên processId và userId (Customer hiện tại)
        public async Task<SampleCollectionFormsSummaryDto?> GetSampleCollectionByCustomerAsync(int processId)
        {
            int customerId = GetCurrentUserId(); // từ JWT

            // Xác nhận rằng processId đó thuộc về customer hiện tại
            var process = await _context.TestProcesses
                .Include(p => p.Request)
                .Include(p => p.SampleCollectionForms)
                .FirstOrDefaultAsync(p =>
                    p.ProcessId == processId &&
                    p.Request.UserId == customerId);

            if (process == null) return null;

            var anyForm = process.SampleCollectionForms.FirstOrDefault();
            if (anyForm == null) return null;

            return new SampleCollectionFormsSummaryDto
            {
                CollectionId = anyForm.CollectionId,
                ProcessId = process.ProcessId,
                location = anyForm.Location,
                sampleProviders = process.SampleCollectionForms.Select(f => new SampleProviders
                {
                    FullName = f.FullName,
                    Gender = f.Gender,
                    Yob = f.Yob,
                    IdType = f.Idtype,
                    Idnumber = f.Idnumber,
                    IdissuedDate = f.IdissuedDate,
                    IdissuedPlace = f.IdissuedPlace,
                    Address = f.Address,
                    SampleType = f.SampleType,
                    Quantity = f.Quantity,
                    Relationship = f.Relationship,
                    HasGeneticDiseaseHistory = f.HasGeneticDiseaseHistory ?? false,
                    FingerprintImage = f.FingerprintImage,
                    ConfirmedBy = f.ConfirmedBy,
                    Note = f.Note
                }).ToList()
            };
        }

        public async Task<List<RequestDto>> GetTestRequestsByCustomerIdAsync()
        {
            int customerId = GetCurrentUserId(); // lấy từ JWT
            var requests = await _context.TestRequests
                .Include(r => r.Service)
                .Include(r => r.CollectType)
                .Where(r => r.UserId == customerId)
                .ToListAsync();

            return requests.Select(request => new RequestDto
            {
                RequestId = request.RequestId,
                ServiceId = request.ServiceId ?? 0,
                ServiceName = request.Service?.ServiceName ?? "Unknown",
                TypeId = request.TypeId,
                CollectType = request.CollectType?.CollectName ?? "Unknown",
                Category = request.Category,
                ScheduleDate = request.ScheduleDate ?? DateTime.MinValue,
                Address = request.Address,
                Status = request.Status,
                CreatedAt = request.CreatedAt ?? DateTime.MinValue
            }).ToList();
        }

        public async Task<GetTestProcessDto> GetTestProcessByTestRequestAsync(int test_requestId)
        {
            var data = await _context.TestProcesses
                       .Where(x => x.RequestId == test_requestId)
                       .Select(x => new GetTestProcessDto
                       {
                           ProcessId = x.ProcessId,
                           KitCode = x.KitCode,
                           ClaimedAt = x.ClaimedAt,
                           CurrentStatus = x.CurrentStatus,
                           Notes = x.Notes,
                           UpdatedAt = x.UpdatedAt
                       })
                       .FirstOrDefaultAsync();

            if (data == null)
            {
                throw new Exception("Không có test Process");

            }
            return data;
        }

        public async Task<GetDeclarantDto> GetRequestDeclarantsByTestRequestIdAsync(int test_requestId)
        {
            var data = await _context.RequestDeclarants
                            .Where(x => x.RequestId == test_requestId)
                            .Select(x => new GetDeclarantDto
                            {
                                DeclarantId = x.DeclarantId,
                                FullName = x.FullName,
                                Gender = x.Gender,
                                Address = x.Address,
                                IdentityIssuedDate = x.IdentityIssuedDate,
                                IdentityIssuedPlace = x.IdentityIssuedPlace,
                                IdentityNumber = x.IdentityNumber,
                                Phone = x.Phone,
                                Email = x.Email
                            }).FirstOrDefaultAsync();
            if (data == null)
            {
                throw new Exception("Không có RequestDeclarants");

            }
            return data;
        }

        public async Task<List<GetTestSampleDto>> GetSampleProvidersByTestRequestIdAsync(int test_requestId)
        {
            var data = _context.TestSamples
                        .Where(x => x.RequestId == test_requestId);

            return data.Select(x => new GetTestSampleDto
            {
                SampleId = x.SampleId,
                OwnerName = x.OwnerName,
                Gender = x.Gender,
                CollectedAt = x.CollectedAt,
                Relationship = x.Relationship,
                SampleType = x.SampleType,
                Yob = x.Yob
            }).ToList();
        }

        public async Task<List<CustomerFeedbackDto>> GetFeedbackByCustomerIdAsync()
        {
            int customerId = GetCurrentUserId(); // lấy từ JWT
            var feedbacks = await _context.Feedbacks
                .Where(f => f.UserId == customerId)
                .Select(f => new CustomerFeedbackDto
                {
                    FeedbackId = f.FeedbackId,
                    ResultId = f.ResultId,
                    Rating = f.Rating,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt
                })
                .ToListAsync();
            return feedbacks;
        }
    }
}
