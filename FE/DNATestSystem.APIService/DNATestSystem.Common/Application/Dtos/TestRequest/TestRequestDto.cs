using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestRequest
{
    public class TestRequestDto
    {
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public int TypeId { get; set; }
        public string? Category { get; set; }
        public DateTime ScheduleDate { get; set; }
        public string Address { get; set; }
        public string? Status { get; set; }
    }
}
