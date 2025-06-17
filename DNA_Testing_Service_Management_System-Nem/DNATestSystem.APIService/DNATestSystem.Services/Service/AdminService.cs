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

        public int CreateManager(ManagerCreateModel manager)
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
            _context.SaveChanges();

            return data.UserId;
        }

        public int CreateServiceMethod(ServiceCreateModel serviceCreateModel)
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
                TimeToResult = serviceCreateModel.TimeToResult,
                IncludeVAT = serviceCreateModel.IncludeVAT,
                CreatedAt = DateTime.UtcNow
            };

            _context.PriceDetails.Add(priceDetail);
            _context.SaveChanges();

            return newService.ServiceId;
        }

        public int CreateStaff(StaffCreateModel staff)
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
            _context.SaveChanges();

            return data.UserId;
        }

        public void UpdateStatusAndRole(UpdateStatusAndRoleModel modelUpdate)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == modelUpdate.Id);
            if (user == null)
                throw new Exception("Người dùng không tồn tại");
            if (user.RoleId == (int)RoleNum.Admin)
                throw new Exception("Không thể chỉnh sửa quyền của Admin khác.");

            user.RoleId = (int)modelUpdate.Role;
            user.Status = (int)modelUpdate.Status;
            user.UpdatedAt = DateTime.UtcNow;
            _context.SaveChanges();
        }
   
        public int DeleteServiceMethod(int service_id)
        {
            var service = _context.Services
                          .Include(u => u.PriceDetails)
                          .Include(s => s.TestRequests)
                          .Include(a => a.UserSelectedServices)
                          .FirstOrDefault(s => s.ServiceId == service_id);
            if (service == null)
                throw new Exception("Service không tồn tại");

            _context.PriceDetails.RemoveRange(service.PriceDetails);
            _context.TestRequests.RemoveRange(service.TestRequests);
            _context.UserSelectedServices.RemoveRange(service.UserSelectedServices);
            _context.Services.Remove(service);

            _context.SaveChanges();
            return 1;
        }

        public int BanUserById(int id)
        {
            var user = _context.Users
                .FirstOrDefault(x => x.UserId == id);
            if (user == null)
            {
                return -2;
            }
            user.Status = (int)StatusNum.Banned;
            user.UpdatedAt = DateTime.UtcNow;


            _context.SaveChanges();
            return user.UserId;
        }

        public List<UserShowModel> getAllUser()
        {
            return _context.Users
            .Select(u => new UserShowModel
            {
                UserId = u.UserId,
                FullName = u.FullName,
                RoleId = u.RoleId,
                Phone = u.Phone,
                Email = u.Email,
                Status = u.Status,
                CreatedAt = u.CreatedAt
            }).ToList();
        }

        public int DeleteServiceMethodByIsPublished(int serviceId)
        {
            var service = _context.Services
               .FirstOrDefault(x => x.ServiceId == serviceId);
            if (service == null)
            {
                return -2;
            }
            service.IsPublished = false;
            service.UpdatedAt = DateTime.UtcNow;

            _context.SaveChanges();
            return service.ServiceId;
        }
        //hàm này để in hết service, bao gốm những tk bị xóa isPublished = false
        public List<ServiceSummaryDto> GetServiceForAdmin()
        {
            var services = _context.Services
                            .Include(s => s.PriceDetails)
                            .AsEnumerable() // để tránh lỗi ?. không hỗ trợ trong Expression Tree
                            .Select(s => new ServiceSummaryDto
                            {
                                Id = s.ServiceId,
                                Slug = s.Slug,
                                ServiceName = s.ServiceName,
                                Category = s.Category,
                                IsUrgent = false, // gán cứng nếu chưa có
                                IncludeVAT = true,
                                Price2Samples = s.PriceDetails.FirstOrDefault()?.Price2Samples,
                                Price3Samples = s.PriceDetails.FirstOrDefault()?.Price3Samples,
                                TimeToResult = s.PriceDetails.FirstOrDefault()?.TimeToResult
                            }).ToList();
            return services;
        }
    }
}
