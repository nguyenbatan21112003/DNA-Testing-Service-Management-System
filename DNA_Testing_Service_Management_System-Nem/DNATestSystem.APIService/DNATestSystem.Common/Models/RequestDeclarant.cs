using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class RequestDeclarant
{
    public int DeclarantId { get; set; }

    public int? RequestId { get; set; }

    public string? FullName { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public string? IdentityNumber { get; set; }

    public DateOnly? IdentityIssuedDate { get; set; }

    public string? IdentityIssuedPlace { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public virtual TestRequest? Request { get; set; }
}
