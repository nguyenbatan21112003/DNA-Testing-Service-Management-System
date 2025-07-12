namespace DNATestSystem.Application.Dtos
{
    public class PendingPasswordChange
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string Otp { get; set; }
    }
   
}
