using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class TestProcess
{
    public int ProcessId { get; set; }

    public int? RequestId { get; set; }

    public int? StaffId { get; set; }

    public DateTime? ClaimedAt { get; set; }

    public string? KitCode { get; set; }

    public string? CurrentStatus { get; set; }

    public string? ProcessState { get; set; }

    public string? Notes { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual TestRequest? Request { get; set; }

    public virtual ICollection<SampleCollectionRecord> SampleCollectionRecords { get; set; } = new List<SampleCollectionRecord>();

    public virtual User? Staff { get; set; }

    public virtual ICollection<TestSample> TestSamples { get; set; } = new List<TestSample>();
}
