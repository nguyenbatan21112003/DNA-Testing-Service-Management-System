using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestSample
{
    public class TestSampleDto
    {
        public string? OwnerName { get; set; }
        public string? Gender { get; set; }
        public string? Relationship { get; set; }
        public string? SampleType { get; set; }
        public int? Yob { get; set; }
    }
}
