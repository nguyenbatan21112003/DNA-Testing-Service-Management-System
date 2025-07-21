using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class SystemLog
{
    public int LogId { get; set; }

    public int UserId { get; set; }

    public string? ActionType { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
