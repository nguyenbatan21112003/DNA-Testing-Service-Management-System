﻿using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class TestResult
{
    public int ResultId { get; set; }

    public int? RequestId { get; set; }

    public int? EnteredBy { get; set; }

    public int? VerifiedBy { get; set; }

    public string? ResultData { get; set; }

    public string? Status { get; set; }

    public DateTime? EnteredAt { get; set; }

    public DateTime? VerifiedAt { get; set; }

    //public DateTime? CollectedAt { get; set; }
    //bỏ

    public virtual User? EnteredByNavigation { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual TestRequest? Request { get; set; }

    public virtual User? VerifiedByNavigation { get; set; }
}
