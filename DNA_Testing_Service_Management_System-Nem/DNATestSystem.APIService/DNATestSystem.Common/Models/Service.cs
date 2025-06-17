using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public string? ServiceName { get; set; }

    public string? Slug { get; set; }    

    public string? Description { get; set; }

    public string? Category { get; set; }

    public byte? NumberSample { get; set; }

    public bool IsUrgent { get; set; }

    public bool IsPublished {  get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<PriceDetail> PriceDetails { get; set; } = new List<PriceDetail>();

    public virtual ICollection<TestRequest> TestRequests { get; set; } = new List<TestRequest>();

    public virtual ICollection<UserSelectedService> UserSelectedServices { get; set; } = new List<UserSelectedService>();
}
