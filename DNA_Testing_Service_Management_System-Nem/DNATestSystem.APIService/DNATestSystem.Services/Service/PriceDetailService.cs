using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Service;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DNATestSystem.Services.Service
{
    public class PriceDetailService : IPriceDetails
    {
        private readonly IApplicationDbContext _context;
       
        public PriceDetailService(IApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }
        public async Task<int> CreatePriceDetailMethodAsync(PriceDetailsModel priceDetailModel)
        {
            var price = new BusinessObjects.Models.PriceDetail
            {
                ServiceId = priceDetailModel.ServiceId,
                Price2Samples = priceDetailModel.Price2Samples,
                Price3Samples = priceDetailModel.Price3Samples,
                TimeToResult = priceDetailModel.TimeToResult,
                IncludeVAT = priceDetailModel.IncludeVAT,
                CreatedAt = DateTime.UtcNow
            };

            _context.PriceDetails.Add(price);
            await _context.SaveChangesAsync();
            return price.PriceId;
        }

        public async Task UpdatePriceDetailMethodAsync(int id, PriceDetailsModel priceDetailsModel)
        {
            var price =  _context.PriceDetails.FirstOrDefault(p => p.PriceId == id);
            if (price == null) throw new Exception("PriceDetail not found");

            price.Price2Samples = priceDetailsModel.Price2Samples;
            price.Price3Samples = priceDetailsModel.Price3Samples;
            price.TimeToResult = priceDetailsModel.TimeToResult;
            price.IncludeVAT = priceDetailsModel.IncludeVAT;
            price.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task DeletePriceDetailMethodAsync(int id)
        {
            var priceDetails = _context.PriceDetails.FirstOrDefault(p => p.PriceId == id);
            if (priceDetails == null) throw new Exception("PriceDetail not found");

            _context.PriceDetails.Remove(priceDetails);
            await _context.SaveChangesAsync();
        }
    }
}
