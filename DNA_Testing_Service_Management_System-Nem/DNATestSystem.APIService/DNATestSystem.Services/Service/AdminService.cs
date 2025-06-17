using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
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
        //public int DeleteUserMethod(int id)
        //{
        // sẽ xem xét lại xem có nên xóa kiểu này hay là chỉ nên ban
        //    var user = _context.Users.FirstOrDefault(u => u.UserId == id);
        //    if (user == null)
        //        throw new Exception("Người dùng không tồn tại");
        //    if (user.RoleId == (int)RoleNum.Admin)
        //        throw new Exception("Không thể chỉnh sửa quyền của Admin khác.");
        //    _context.Users.Remove(user);
        //    _context.SaveChanges();
        //    return 1;
        //}
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

        public int CreatePriceDetail(PriceDetailsModel model)
        {
            var price = new PriceDetail
            {
                ServiceId = model.ServiceId,
                Price2Samples = model.Price2Samples,
                Price3Samples = model.Price3Samples,
                TimeToResult = model.TimeToResult,
                IncludeVAT = model.IncludeVAT,
                CreatedAt = DateTime.UtcNow
            };

            _context.PriceDetails.Add(price);
            _context.SaveChanges();
            return price.PriceId;
        }

        public void UpdatePriceDetailMethod(int id, PriceDetailsModel priceDetailsModel)
        {
            var price = _context.PriceDetails.FirstOrDefault(p => p.PriceId == id);
            if (price == null) throw new Exception("PriceDetail not found");

            price.Price2Samples = priceDetailsModel.Price2Samples;
            price.Price3Samples = priceDetailsModel.Price3Samples;
            price.TimeToResult = priceDetailsModel.TimeToResult;
            price.IncludeVAT = priceDetailsModel.IncludeVAT;
            price.UpdatedAt = DateTime.UtcNow;

            _context.SaveChanges();
        } 

    }
}
