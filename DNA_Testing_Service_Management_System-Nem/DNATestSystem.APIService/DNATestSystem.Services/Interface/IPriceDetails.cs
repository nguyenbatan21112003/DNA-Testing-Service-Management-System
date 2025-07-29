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
        Task<int> CreatePriceDetailMethodAsync(PriceDetailsModel priceDetailModel);
        Task UpdatePriceDetailMethodAsync(int id, PriceDetailsModel priceDetailsModel);
        Task DeletePriceDetailMethodAsync(int id);
    }
}
