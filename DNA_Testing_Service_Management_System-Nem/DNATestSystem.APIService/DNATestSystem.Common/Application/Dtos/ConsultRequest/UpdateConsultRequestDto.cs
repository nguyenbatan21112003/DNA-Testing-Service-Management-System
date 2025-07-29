using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest
{
    public class UpdateConsultRequestDto
    {
        public int ConsultId { get; set; }
        public string? Status { get; set; } 
        public int? StaffId { get; set; } // staff who handle this consult request
        public DateTime? RepliedAt { get; set; }
    }
}
