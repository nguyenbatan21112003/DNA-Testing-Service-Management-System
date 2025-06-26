using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;

namespace DNATestSystem.Services.Interface
{
    public interface IStaffService
    {
        Task<List<PendingConsultDto>> PendingTestResultsAsync();
    }
}
