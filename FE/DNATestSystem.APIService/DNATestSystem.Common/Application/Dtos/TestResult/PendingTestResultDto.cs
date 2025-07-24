using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class PendingTestResultDto
    {
        public int ResultID { get; set; }
        public int? RequestID { get; set; }
        public string? CustomerName { get; set; }
        public string? ServiceName { get; set; }
        public string? EnteredBy { get; set; }
        public DateTime? EnteredAt { get; set; }
        public string? ResultData { get; set; }
        public string? Status { get; set; }

    }
}
