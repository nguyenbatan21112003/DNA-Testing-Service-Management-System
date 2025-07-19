using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class UserSelectedService
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? ServiceId { get; set; }

    public DateTime? SelectedAt { get; set; }

    public string? Note { get; set; }

    public bool? ConvertedToRequest { get; set; }

    public bool? IncludeVat { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
