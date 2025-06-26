using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class StaffService : IStaffService
    {
        private readonly IApplicationDbContext _context;
        // Constructor injection for the database context
        public StaffService(IApplicationDbContext context) {

            _context = context;
        }

        public async Task<List<PendingConsultDto>> PendingTestResultsAsync()
        {
            var data = await _context.ConsultRequests
                            .Where(s => s.Status == "Pending")
                            .Select(x => new PendingConsultDto
                            {
                                ConsultId = x.ConsultId,
                                FullName = x.FullName,
                                Phone = x.Phone,
                                Category = x.Category,
                                ServiceId = x.ServiceId,
                                Message = x.Message,
                                CreatedAt = x.CreatedAt,
                                RepliedAt = x.RepliedAt
                            })
                            .ToListAsync();
            return data;
        }
    }
}
