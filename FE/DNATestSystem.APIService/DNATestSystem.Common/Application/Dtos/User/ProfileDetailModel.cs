using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entities.Enum;

namespace DNATestSystem.BusinessObjects.Application.Dtos.User
{
    public class ProfileDetailModel
    {
        public int? UserID {  get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int? RoleID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public StatusNum Status { get; set; }

        public ProfileDto ProfileDto { get; set; }
    }
}
