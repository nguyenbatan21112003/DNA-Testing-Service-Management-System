using System.ComponentModel.DataAnnotations;

namespace DNATestSystem.Application.Dtos
{
    public class VerifyPasswordModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required] 
        
        public string CurrentPassword { get; set; }
    }
}
