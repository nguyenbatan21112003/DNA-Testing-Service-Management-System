using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant
{
    public class DeclarantDto
    {
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string IdentityNumber { get; set; }
        public DateTime? IdentityIssuedDate { get; set; }
        public string IdentityIssuedPlace { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
