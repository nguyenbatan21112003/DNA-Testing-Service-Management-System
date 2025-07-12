using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.Application.Dtos;
using DNATestSystem.BusinessObjects.Entites.Enum;
using DNATestSystem.BusinessObjects.Entites;

namespace DNATestSystem.BusinessObjects.Entites
{
    public class User 
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public DateTime createAt { get; set; } = DateTime.Now;
        public Role Role { get; set; }
        public Status status { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }

}
