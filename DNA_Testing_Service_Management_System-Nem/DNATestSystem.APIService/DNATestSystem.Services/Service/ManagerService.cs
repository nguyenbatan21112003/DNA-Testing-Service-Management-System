using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class ManagerService : IManagerService
    {
        private readonly IApplicationDbContext _context;
        public ManagerService(IApplicationDbContext context) 
        {
            _context = _context;
        }

        public List<PendingTestResultDto> GetPendingTestResults()
        {
            var pendingResults = _context.TestResults
                .Where(r => r.Status == "Pending")
                .Include(r => r.Request)
                    .ThenInclude(req => req.User)
                .Include(r => r.Request)
                    .ThenInclude(req => req.Service)
                .Include(r => r.EnteredByNavigation)
                .Select(r => new PendingTestResultDto
                {
                    ResultID = r.ResultId,
                    RequestID = r.RequestId,
                    CustomerName = r.Request.User.FullName,
                    ServiceName = r.Request.Service.ServiceName,
                    EnteredBy = r.EnteredByNavigation.FullName,
                    EnteredAt = r.EnteredAt,
                    ResultData = r.ResultData,
                    Status = r.Status
                })
                .ToList();

            return pendingResults;
        }


    }
}
