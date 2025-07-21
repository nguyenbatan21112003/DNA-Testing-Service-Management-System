using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public int? RequestId { get; set; }

    public DateTime? PaidAt { get; set; }

    public virtual TestRequest? Request { get; set; }
}
