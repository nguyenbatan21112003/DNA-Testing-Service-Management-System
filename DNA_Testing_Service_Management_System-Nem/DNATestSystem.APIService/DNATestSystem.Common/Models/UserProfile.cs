using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class UserProfile
{
    public int ProfileId { get; set; }

    public int? UserId { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? IdentityId { get; set; }

    public string? Fingerfile { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? User { get; set; }
}
