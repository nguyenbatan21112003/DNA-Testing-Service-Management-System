using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Entites
{
    public class User
    {
        public int Id { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string salting { get; set; }
        public DateTime createAt { get; set; } = DateTime.Now;

        public Role Role { get; set; }
    }
    public enum Role
    {
        Guest,
        Customer,
        Staff,
        Manager,
        Admin
    }
}
