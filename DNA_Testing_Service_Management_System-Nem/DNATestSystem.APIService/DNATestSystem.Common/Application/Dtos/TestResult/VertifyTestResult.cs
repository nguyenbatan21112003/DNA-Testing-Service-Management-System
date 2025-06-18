using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class VertifyTestResult
    {
        public int ResultID { get; set; }
        public int ManagerId { get; set; }
        public DateTime VerifiedAt { get; set; }
    }
}
