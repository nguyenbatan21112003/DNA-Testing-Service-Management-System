using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class PriceDetail
{
    public int PriceId { get; set; }

    public int? ServiceId { get; set; }

    public decimal? Price2Samples { get; set; }

    public decimal? Price3Samples { get; set; }

    public string? TimeToResult { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IncludeVat { get; set; }

    public virtual Service? Service { get; set; }
}
