using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Staff
{
    public class PendingConsultDto
    {
        public int ConsultId { get; set; }

        public string? FullName { get; set; }

        public string? Phone { get; set; }

        public string? Category { get; set; }

        public int? ServiceId { get; set; }

        public string? Message { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? RepliedAt { get; set; }
    }
}
