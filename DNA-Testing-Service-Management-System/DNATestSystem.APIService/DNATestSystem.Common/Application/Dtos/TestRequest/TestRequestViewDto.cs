using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestRequest
{
    public class TestRequestViewDto
    {
        public int RequestId { get; set; }
        public int ServiceId { get; set; }
        public string? ServiceName { get; set; }
        public int TypeId { get; set; }
        public string? CollectionType { get; set; }
        public string? Category { get; set; }
        public DateTime? ScheduleDate { get; set; }
        public string Address { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }

        public DeclarantDto Declarant { get; set; }
        public List<TestSampleDto> Sample { get; set; }
         
    }
}
