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
            _context = context;
        }

        public List<PendingTestResultDto> GetPendingTestResults()
        {
            var pendingResults = _context.TestResults
                .Include(tr => tr.Request)
                    .ThenInclude(r => r.User)
                .Include(tr => tr.Request)
                    .ThenInclude(r => r.Service)
                .Include(tr => tr.EnteredByNavigation)
                .Where(tr => tr.Status == "Pending")
                .Select(tr => new PendingTestResultDto
                {
                    ResultID = tr.ResultId,
                    RequestID = tr.RequestId,
                    CustomerName = tr.Request != null ? tr.Request.User.FullName : null,
                    ServiceName = tr.Request != null ? tr.Request.Service.ServiceName : null,
                    EnteredBy = tr.EnteredByNavigation != null ? tr.EnteredByNavigation.FullName : null,
                    EnteredAt = tr.EnteredAt,
                    ResultData = tr.ResultData,
                    Status = tr.Status
                })
                .ToList();

            return pendingResults;
        }



    }
}
