using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.BusinessObjects.Application.Dtos.Invoice;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
namespace DNATestSystem.BusinessObjects.Application.Dtos.TestRequest
{
    public class TestRequestSubmissionDto
    {
        public InvoiceDto Invoice { get; set; }
        public TestRequestDto TestRequest { get; set; }
        public DeclarantDto Declarant { get; set; }
        public List<TestSampleDto> Samples { get; set; }
    }
}
