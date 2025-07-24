using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int? ResultId { get; set; }

    public int? UserId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual TestResult? Result { get; set; }

    public virtual User? User { get; set; }
}
