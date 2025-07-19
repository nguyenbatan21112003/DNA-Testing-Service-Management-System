using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestProcess
{
    public class GetTestProcessDto
    {
        public int ProcessId { get; set; }
        public DateTime? ClaimedAt { get; set; }
        public string KitCode { get; set; }
        public string CurrentStatus { get; set; }
        public string Notes { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
