using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entities.Enum;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Admin
{
    public class ManagerCreateModel
    {
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public StatusNum Status { get; set; }
    }
}
