using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Entites;

namespace DNATestSystem.BusinessObjects.Entites
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        public string Token { get; set; }

        public DateTime ExpireTime { get; set; }

        public bool IsRevoked { get; set; } //

        public int UsedID { get; set; }

        public User User { get; set; }
    }
}
