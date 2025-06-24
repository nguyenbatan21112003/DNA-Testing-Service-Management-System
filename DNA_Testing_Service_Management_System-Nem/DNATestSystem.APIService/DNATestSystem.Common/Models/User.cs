using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? FullName { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public int? RoleId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? Status { get; set; }

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

    public virtual ICollection<ConsultRequest> ConsultRequests { get; set; } = new List<ConsultRequest>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual Role? Role { get; set; }

    public virtual ICollection<SampleCollectionRecord> SampleCollectionRecords { get; set; } = new List<SampleCollectionRecord>();

    public virtual ICollection<SystemLog> SystemLogs { get; set; } = new List<SystemLog>();

    public virtual ICollection<TestProcess> TestProcesses { get; set; } = new List<TestProcess>();

    public virtual ICollection<TestRequest> TestRequests { get; set; } = new List<TestRequest>();

    public virtual ICollection<TestResult> TestResultEnteredByNavigations { get; set; } = new List<TestResult>();

    public virtual ICollection<TestResult> TestResultVerifiedByNavigations { get; set; } = new List<TestResult>();

    public virtual ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();

    public virtual ICollection<UserSelectedService> UserSelectedServices { get; set; } = new List<UserSelectedService>();
}
