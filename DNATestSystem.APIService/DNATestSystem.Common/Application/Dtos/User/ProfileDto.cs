using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.User
{
    public class ProfileDto
    {
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? IdentityID { get; set; }
        public string? Fingerfile { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}
