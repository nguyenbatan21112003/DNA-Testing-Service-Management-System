using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Entities.Enum;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Hepler;
using DNATestSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;


namespace DNATestSystem.Services.Service
{
    public class AdminService : IAdminService
    {
        private readonly IApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;
        public AdminService(IApplicationDbContext applicationDbContext
                            , IOptions<JwtSettings> jwtSettings)
        {
            _context = applicationDbContext;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<int> CreateManagerAsync(ManagerCreateModel manager)
        {
            var password = manager.Password;
            var hashPassword = HashHelper.BCriptHash(password);

            // Tạo user mới
            var data = new DNATestSystem.BusinessObjects.Models.User
            {
                FullName = manager.FullName,
                Email = manager.EmailAddress,
                Password = hashPassword,
                Phone = manager.PhoneNumber,
                RoleId = (int)RoleNum.Manager,
                Status = (int)StatusNum.Verified
            };

            _context.Users.Add(data);
            await _context.SaveChangesAsync();

            return data.UserId;
        }

        public async Task<int> CreateServiceMethodAsync(ServiceCreateModel serviceCreateModel)
        {
            var newService = new BusinessObjects.Models.Service
            {
                ServiceName = serviceCreateModel.ServiceName,
                Slug = serviceCreateModel.Slug,
                Description = serviceCreateModel.Description,
                Category = serviceCreateModel.Category,
                NumberSample = serviceCreateModel.NumberSample,
                IsUrgent = serviceCreateModel.IsUrgent,
                IsPublished = serviceCreateModel.IsPublished,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Services.Add(newService);
            _context.SaveChanges(); // Lưu trước để có ServiceId

            var priceDetail = new PriceDetail
            {
                ServiceId = newService.ServiceId,
                Price2Samples = serviceCreateModel.Price2Samples,
                Price3Samples = serviceCreateModel.Price3Samples,
                IncludeVAT = serviceCreateModel.IncludeVAT,
                CreatedAt = DateTime.UtcNow
            };

            _context.PriceDetails.Add(priceDetail);
            await _context.SaveChangesAsync();

            return newService.ServiceId;
        }

        public async Task<int> CreateStaffAsync(StaffCreateModel staff)
        {
            var password = staff.Password;
            var hashPassword = HashHelper.BCriptHash(password);

            // Tạo user mới
            var data = new DNATestSystem.BusinessObjects.Models.User
            {
                FullName = staff.FullName,
                Email = staff.EmailAddress,
                Password = hashPassword,
                Phone = staff.PhoneNumber,
                RoleId = (int)RoleNum.Staff,
                Status = (int)StatusNum.Verified
            };

            _context.Users.Add(data);
            await _context.SaveChangesAsync();

            return data.UserId;
        }

        public async Task UpdateStatusAndRoleAsync(UpdateStatusAndRoleModel modelUpdate)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == modelUpdate.Id);
            if (user == null)
                throw new Exception("Người dùng không tồn tại");
            if (user.RoleId == (int)RoleNum.Admin)
                throw new Exception("Không thể chỉnh sửa quyền của Admin khác.");

            user.RoleId = (int)modelUpdate.Role;
            user.Status = (int)modelUpdate.Status;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteServiceMethodAsync(int service_id)
        {
            var service = await _context.Services
                          .Include(u => u.PriceDetails)
                          .Include(s => s.TestRequests)
                          .Include(a => a.UserSelectedServices)
                          .FirstOrDefaultAsync(s => s.ServiceId == service_id);
            if (service == null)
                throw new Exception("Service không tồn tại");

            _context.PriceDetails.RemoveRange(service.PriceDetails);
            _context.TestRequests.RemoveRange(service.TestRequests);
            _context.UserSelectedServices.RemoveRange(service.UserSelectedServices);
            _context.Services.Remove(service);

            await _context.SaveChangesAsync();
            return 1;
        }

        public async Task<int> BanUserByIdAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserId == id);
            if (user == null)
            {
                return -2;
            }
            user.Status = (int)StatusNum.Banned;
            user.UpdatedAt = DateTime.UtcNow;


            await _context.SaveChangesAsync();
            return user.UserId;
        }

        public async Task<List<UserShowModel>> GetAllUserAsync()
        {
            return await _context.Users
            .Select(u => new UserShowModel
            {
                UserId = u.UserId,
                FullName = u.FullName,
                RoleId = u.RoleId,
                Phone = u.Phone,
                Email = u.Email,
                Status = u.Status,
                CreatedAt = u.CreatedAt
            }).ToListAsync();
        }

        public async Task<int> DeleteServiceMethodByIsPublishedAsync(int serviceId)
        {
            var service = await _context.Services
               .FirstOrDefaultAsync(x => x.ServiceId == serviceId);
            if (service == null)
            {
                return -2;
            }
            service.IsPublished = false;
            service.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return service.ServiceId;
        }
        //hàm này để in hết service, bao gốm những tk bị xóa isPublished = false
        public async Task<List<ServiceSummaryDto>> GetServiceForAdminAsync()
        {
            var priceDetails = await _context.Services
                                    .Include(s => s.PriceDetails)
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

        public async Task UpdateServiceAndPriceAsync(ServiceUpdateModel model)
        {
            var service = await _context.Services
                            .Include (s => s.PriceDetails)
                            .FirstOrDefaultAsync(s => s.ServiceId == model.ServiceID);

            if(service == null)
            {
                throw new Exception($"Service with ID {model.ServiceID} not found.");
            }
            // Cập nhật Service
            service.ServiceName = model.ServiceName;
            service.Description = model.Description;
            service.Slug = model.Slug;
            service.Category = model.Category;
            service.NumberSample = model.NumberSample;
            service.IsUrgent = model.IsUrgent;
            service.IsPublished = model.IsPublished;
            service.UpdatedAt = DateTime.UtcNow;

            // Cập nhật PriceDetail
            var priceDetail = _context.PriceDetails.FirstOrDefault(p => p.ServiceId == model.ServiceID);
            if (priceDetail != null)
            {
                priceDetail.Price2Samples = model.Price2Samples;
                priceDetail.Price3Samples = model.Price3Samples;
                priceDetail.TimeToResult = model.TimeToResult;
                priceDetail.IncludeVAT = model.IncludeVAT;
                priceDetail.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

    }
}
