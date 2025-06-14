using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int? RequestId { get; set; }

    public decimal? Amount { get; set; }

    public string? PaymentMethod { get; set; }

    public DateTime? PaidAt { get; set; }

    public virtual TestRequest? Request { get; set; }
}
