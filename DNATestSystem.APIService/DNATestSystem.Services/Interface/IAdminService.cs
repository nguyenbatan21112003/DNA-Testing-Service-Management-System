using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entites;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.BusinessObjects.Application.Dtos.User;
namespace DNATestSystem.Services.Interface
{
    public interface IAdminService

    {
        // Staff and Manager
        Task<int> CreateStaffAsync(StaffCreateModel staff);
        Task<int> CreateManagerAsync(ManagerCreateModel manager);
        Task UpdateStatusAndRoleAsync(UpdateStatusAndRoleModel modelUpdate);

        // Service
        Task<int> CreateServiceMethodAsync(ServiceCreateModel serviceCreateModel);
        Task<int> DeleteServiceMethodAsync(int id);
        Task<int> DeleteServiceMethodByIsPublishedAsync(int serviceId);
        Task UpdateServiceAndPriceAsync(ServiceUpdateModel model);

        Task<List<ServiceSummaryDto>> GetServiceForAdminAsync();

        // User
        Task<List<UserShowModel>> GetAllUserAsync();
        Task<int> BanUserByIdAsync(int id);
    }
}
            