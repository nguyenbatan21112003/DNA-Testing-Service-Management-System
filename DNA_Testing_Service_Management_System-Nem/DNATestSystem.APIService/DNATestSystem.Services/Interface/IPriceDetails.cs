using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;

namespace DNATestSystem.Services.Interface
{
    public interface IPriceDetails
    {
        //PriceDetails
        int CreatePriceDetailMethod(PriceDetailsModel priceDetailModel);
        void UpdatePriceDetailMethod(int id, PriceDetailsModel priceDetailsModel);
        void DeletePriceDetailMethod(int id);
    }
}
