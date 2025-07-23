using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestProcess
{
    public class ManagerUpdateTestProcessDto
    {
        public int RequestId { get; set; }
        public string CurrentStatus { get; set; }   
        public DateTime? UpdatedAt { get; set; }
    }
}
