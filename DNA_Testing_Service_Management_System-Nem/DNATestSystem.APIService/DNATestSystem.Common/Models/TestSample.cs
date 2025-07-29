using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class TestSample
{
    public int SampleId { get; set; }

    public int? RequestId { get; set; }

    //public int? ProcessId { get; set; }
    //bỏ

    public string? OwnerName { get; set; }

    public string? Gender { get; set; }

    public string? Relationship { get; set; }

    public string? SampleType { get; set; }

    public int? Yob { get; set; }

    public DateTime? CollectedAt { get; set; }

    public virtual TestProcess? Process { get; set; }

    public virtual TestRequest? Request { get; set; }
}
