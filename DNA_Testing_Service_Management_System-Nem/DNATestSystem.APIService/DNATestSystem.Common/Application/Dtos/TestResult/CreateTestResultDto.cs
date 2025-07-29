using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestResult
{
    public class CreateTestResultDto
    {
        public int RequestId { get; set; }
        public string? Data { get; set; } = string.Empty;
    }
}
