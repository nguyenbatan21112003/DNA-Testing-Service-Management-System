using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class TestResultVerifyDto
    {
        public int ResultId { get; set; }
        public int ManagerId { get; set; }
        public string Status { get; set; } =  "Verified";  
    }
}
