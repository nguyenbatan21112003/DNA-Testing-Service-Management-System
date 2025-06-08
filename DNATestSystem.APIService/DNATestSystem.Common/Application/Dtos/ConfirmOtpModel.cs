using System.ComponentModel.DataAnnotations;

namespace DNATestSystem.Application.Dtos
{
    public class ConfirmOtpModel
    {
        [Required]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits.")]
        public string Otp { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

}
