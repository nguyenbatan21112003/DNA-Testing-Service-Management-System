using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms
{
    public class SampleProviders
    {
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


    }
}
