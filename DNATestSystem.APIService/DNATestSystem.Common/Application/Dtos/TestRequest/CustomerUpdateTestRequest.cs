using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestRequest
{
    public class CustomerUpdateTestRequest
    {
        public int RequestId { get; set; }
        public DateTime? ScheduleDate { get; set; }
        public string? Address { get; set; }
    }
}
