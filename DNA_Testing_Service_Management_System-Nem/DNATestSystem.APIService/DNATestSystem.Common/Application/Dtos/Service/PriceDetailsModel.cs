using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Service
{
    public class PriceDetailsModel
    {
        public int ServiceId { get; set; }
        public decimal? Price2Samples { get; set; }
        public decimal? Price3Samples { get; set; }
        public string? TimeToResult { get; set; }
        public bool? IncludeVAT { get; set; }
    }

}
