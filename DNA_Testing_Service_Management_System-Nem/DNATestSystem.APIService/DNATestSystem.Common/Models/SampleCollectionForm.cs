using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DNATestSystem.BusinessObjects.Models;

public partial class SampleCollectionForm
{
    [Key]
    public int CollectionId { get; set; }

    public int? RequestId { get; set; }

    public int? ProcessId { get; set; }

    public string? Location { get; set; }

    public string? FullName { get; set; }

    public int? Yob { get; set; }

    public string? Gender { get; set; }

    public string? Idtype { get; set; }

    public string? Idnumber { get; set; }

    public DateOnly? IdissuedDate { get; set; }

    public string? IdissuedPlace { get; set; }

    public string? Address { get; set; }

    public string? SampleType { get; set; }

    public string? Quantity { get; set; }

    public string? Relationship { get; set; }

    public bool? HasGeneticDiseaseHistory { get; set; }

    public string? FingerprintImage { get; set; }

    public string? ConfirmedBy { get; set; }

    public string? Note { get; set; }

    public virtual TestProcess? Process { get; set; }

    public virtual TestRequest? Request { get; set; }
}
