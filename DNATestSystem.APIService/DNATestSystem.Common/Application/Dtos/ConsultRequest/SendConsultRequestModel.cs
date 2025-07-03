using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest
{
    public class SendConsultRequestModel
    {
        public string? FullName { get; set; } // Full name of the person making the request
        public string? Phone { get; set; } // Phone number of the person making the request
        public string? Category { get; set; } // Category of the consultation request
        public int? ServiceId { get; set; } // ID of the service related to the request
        public string? Message { get; set; } // Message or details of the consultation request
    }
}
