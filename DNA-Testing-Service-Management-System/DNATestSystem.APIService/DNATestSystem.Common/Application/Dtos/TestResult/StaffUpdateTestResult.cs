using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class StaffUpdateTestResult
    {
        public int ResultID { get; set; }
        public string? ResultData { get; set; }
        public DateTime? EnteredAt { get; set; }
        public string? Status { get; set; }
    }
}
