using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class ConsultRequest
{
    public int ConsultId { get; set; }

    public int? StaffId { get; set; }

    public string? FullName { get; set; }

    public string? Phone { get; set; }

    public string? Category { get; set; }

    public int? ServiceId { get; set; }

    public string? Message { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? RepliedAt { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? Staff { get; set; }
}
