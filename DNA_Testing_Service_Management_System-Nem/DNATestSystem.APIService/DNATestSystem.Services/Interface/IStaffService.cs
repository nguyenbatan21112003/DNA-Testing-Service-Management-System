using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Services.Interface
{
    public interface IStaffService
    {
        Task<List<PendingConsultDto>> PendingConsultResultsAsync();
        Task<bool> UpdateConsultResultAsync(UpdateConsultRequestDto updateConsultRequestDto);
        //Task<(bool Success, string Message, int? RequestId)> SubmitTestRequestAsync(TestRequestSubmissionDto dto);
        Task<List<TestRequestViewDto>> PendingTestRequestAsync();
        Task<List<TestRequestViewDto>> AtCenterTestRequestAsync();
        Task<List<TestRequestViewDto>> AtHomeTestRequestAsync();
        //
        Task<(bool Success, string Message)> AssignTestProcessAsync(AssignTestProcessDto dto);
        Task<List<TestRequestViewDto>> GetAtCenterAdministrativeRequestsAsync(int staffId);
        //
        Task<List<TestProcessDto>> GetTestProcessesByStaffIdAsync(int staffId);

    }
}
