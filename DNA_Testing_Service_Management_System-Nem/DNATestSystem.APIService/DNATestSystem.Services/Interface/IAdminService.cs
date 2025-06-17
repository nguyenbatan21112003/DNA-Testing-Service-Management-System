using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entites;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
namespace DNATestSystem.Services.Interface
{
    public interface IAdminService
    {
        int CreateStaff(StaffCreateModel staff);
        int CreateManager(ManagerCreateModel manager);
        void UpdateStatusAndRole(UpdateStatusAndRoleModel modelUpdate);
        //Service
        int CreateServiceMethod(ServiceCreateModel serviceCreateModel);
        int DeleteServiceMethod(int id);
        //PriceDetails
        int CreatePriceDetailMethod(PriceDetailsModel priceDetailModel);
        void UpdatePriceDetailMethod(int id , PriceDetailsModel priceDetailsModel);

    }
}
            