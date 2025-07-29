using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Service
{
    public class ServiceCreateModel
    {
        public string ServiceName { get; set; }
        public string Slug { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public byte? NumberSample { get; set; }
        public bool IsUrgent { get; set; }
        public bool IsPublished { get; set; }

        public decimal Price2Samples { get; set; }
        public decimal Price3Samples { get; set; }
        public bool IncludeVAT { get; set; }
        public string? TimeToResult { get; set; }

    }
}
