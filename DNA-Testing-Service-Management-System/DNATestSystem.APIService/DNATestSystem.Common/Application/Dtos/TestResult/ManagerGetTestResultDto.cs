using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class ManagerGetTestResultDto
    {
        public int ResultId { get; set; }
        public int? RequestId { get; set; }
        public int? EnteredBy { get; set; }
        public int? VerifiedBy { get; set; }
        public string? ResultData { get; set; }
        public string? Status { get; set; }
        public DateTime? EnteredAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}
