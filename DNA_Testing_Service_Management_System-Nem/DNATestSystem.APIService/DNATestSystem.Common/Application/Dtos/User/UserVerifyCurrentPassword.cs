using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.User
{
    public class UserVerifyCurrentPassword
    {
        public string? Email { get; set; }
        public string? CurrentPassword { get; set; }
    }
}
