using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class TestRequest
{
    public int RequestId { get; set; }

    public int? UserId { get; set; }

    public int? ServiceId { get; set; }

    public int? TypeId { get; set; }

    public string? Category { get; set; }

    public DateOnly? ScheduleDate { get; set; }

    public string? Address { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<RequestDeclarant> RequestDeclarants { get; set; } = new List<RequestDeclarant>();

    public virtual ICollection<SampleCollectionRecord> SampleCollectionRecords { get; set; } = new List<SampleCollectionRecord>();

    public virtual Service? Service { get; set; }

    public virtual ICollection<TestProcess> TestProcesses { get; set; } = new List<TestProcess>();

    public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();

    public virtual ICollection<TestSample> TestSamples { get; set; } = new List<TestSample>();

    public virtual CollectType? Type { get; set; }

    public virtual User? User { get; set; }
}
