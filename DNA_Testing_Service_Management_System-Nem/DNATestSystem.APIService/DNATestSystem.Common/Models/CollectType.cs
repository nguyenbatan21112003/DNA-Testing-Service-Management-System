using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class CollectType
{
    public int CollectId { get; set; }

    public string? CollectName { get; set; }

    public virtual ICollection<TestRequest> TestRequests { get; set; } = new List<TestRequest>();
}
