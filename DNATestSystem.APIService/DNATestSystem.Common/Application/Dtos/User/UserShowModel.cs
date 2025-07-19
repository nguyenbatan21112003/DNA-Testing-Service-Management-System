using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.User
{
    public class UserShowModel
    {
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public int? RoleId { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
