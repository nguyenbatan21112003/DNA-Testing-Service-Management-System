using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entities.Enum;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Admin
{
    public class UpdateStatusAndRoleModel
    {
        public int Id { get; set; }
        public RoleNum Role { get; set; }
        public StatusNum Status { get; set; }
    }
}
