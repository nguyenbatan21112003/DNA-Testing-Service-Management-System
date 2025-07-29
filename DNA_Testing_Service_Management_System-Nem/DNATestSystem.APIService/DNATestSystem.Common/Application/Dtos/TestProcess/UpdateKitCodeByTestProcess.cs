using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestProcess
{
    public class UpdateKitCodeByTestProcess
    {
        public int? ProcessId { get; set; }
        public string? KitCode { get; set; }
    }
}
