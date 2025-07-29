using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Admin
{
    public class UpdatePhoneNumberNameAndStatus
    {
        public int UserId { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public int? Status { get; set; }
    }
}
