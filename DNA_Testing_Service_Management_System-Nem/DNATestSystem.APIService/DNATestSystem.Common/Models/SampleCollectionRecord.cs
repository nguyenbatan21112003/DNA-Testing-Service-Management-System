using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class SampleCollectionRecord
{
    public int RecordId { get; set; }

    public int? RequestId { get; set; }

    public int? ProcessId { get; set; }

    public int? CollectedBy { get; set; }

    public string? Location { get; set; }

    public DateTime? CollectedAt { get; set; }

    public string? ConfirmedBy { get; set; }

    public string? Note { get; set; }

    public virtual User? CollectedByNavigation { get; set; }

    public virtual TestProcess? Process { get; set; }

    public virtual TestRequest? Request { get; set; }

    public virtual ICollection<SampleCollectionSample> SampleCollectionSamples { get; set; } = new List<SampleCollectionSample>();
}
