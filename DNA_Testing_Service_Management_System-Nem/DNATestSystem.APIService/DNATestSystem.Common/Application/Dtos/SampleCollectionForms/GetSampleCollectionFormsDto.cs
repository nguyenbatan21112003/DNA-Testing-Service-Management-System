using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms
{
    public class GetSampleCollectionFormsDto
    {
        public int CollectionId { get; set; }
        public int ProcessId { get; set; }
        public string Location { get; set; }
        public List<SampleProviders> sampleProviders { get; set; } = new List<SampleProviders>();
    }
}
    