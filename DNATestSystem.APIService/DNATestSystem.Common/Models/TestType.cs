using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class TestType
{
    public int TypeId { get; set; }

    public string? TypeName { get; set; }

    public virtual ICollection<TestRequest> TestRequests { get; set; } = new List<TestRequest>();
}
