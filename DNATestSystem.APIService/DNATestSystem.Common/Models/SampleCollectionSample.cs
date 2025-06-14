using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class SampleCollectionSample
{
    public int CollectedSampleId { get; set; }

    public int? RecordId { get; set; }

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

    public string? CollectedBy { get; set; }

    public bool? HasGeneticDiseaseHistory { get; set; }

    public virtual SampleCollectionRecord? Record { get; set; }
}
