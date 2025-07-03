using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestProcess
{
    public class TestProcessDto
    {
        public RequestDto Request { get; set; }
        public TestProcessInfoDto TestProcess { get; set; }
        public DeclarantDto Declarant { get; set; }
        public List<TestRequestSampleDto> Samples { get; set; }
    }
}
