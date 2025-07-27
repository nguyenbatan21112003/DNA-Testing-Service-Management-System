using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Pdf
{
    public class PdfExportDto
    {
        public int RequestId { get; set; }
        public string ServiceName { get; set; }
        public string Category { get; set; }
        public DateTime? ScheduleDate { get; set; }
        public string RequestAddress { get; set; }
        public string DeclarantName { get; set; }
        public string StaffName { get; set; }
        public string KitCode { get; set; }
        public string ResultData { get; set; }
        public string? IdentityNumber { get; set; }
        public string? PhoneNumber { get; set; } 
        public List<TestSampleDto> Samples { get; set; } 
    }
}

