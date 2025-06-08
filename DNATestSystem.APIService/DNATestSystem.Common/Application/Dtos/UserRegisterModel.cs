namespace DNATestSystem.Application.Dtos
{
    public class UserRegisterModel
    {

        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
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
