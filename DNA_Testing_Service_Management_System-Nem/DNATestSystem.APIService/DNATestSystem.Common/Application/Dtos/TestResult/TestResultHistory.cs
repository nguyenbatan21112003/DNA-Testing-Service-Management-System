using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class TestResultHistory
    {
        public RequestDto Request { get; set; } 
        public TestProcessHistoryDto TestProcess { get; set; }
        public DeclarantDto Declarant { get; set; }
    }
}
