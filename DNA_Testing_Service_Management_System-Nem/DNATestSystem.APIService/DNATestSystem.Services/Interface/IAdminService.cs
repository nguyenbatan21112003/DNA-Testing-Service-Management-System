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
        //Staff and manager
        int CreateStaff(StaffCreateModel staff);
        int CreateManager(ManagerCreateModel manager);
        void UpdateStatusAndRole(UpdateStatusAndRoleModel modelUpdate);
        //Service
        int CreateServiceMethod(ServiceCreateModel serviceCreateModel);
        int DeleteServiceMethod(int id);
        int DeleteServiceMethodByIsPublished(int serviceId);
        void updateServiceAndPrice(ServiceUpdateModel model);
        
        
        List<ServiceSummaryDto> GetServiceForAdmin();
        //User
        List<UserShowModel> getAllUser();
        int BanUserById(int id);
    }
}
            