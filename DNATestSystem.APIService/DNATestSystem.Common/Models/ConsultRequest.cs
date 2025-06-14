using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class ConsultRequest
{
    public int ConsultId { get; set; }

    public int? CustomerId { get; set; }

    public int? StaffId { get; set; }

    public string? Subject { get; set; }

    public string? Message { get; set; }

    public string? ReplyMessage { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? RepliedAt { get; set; }

    public virtual User? Customer { get; set; }

    public virtual User? Staff { get; set; }
}
