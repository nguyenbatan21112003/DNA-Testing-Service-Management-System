using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Invoice
{
    public class InvoiceDto
    {
        public int RequestId { get; set; }
        public DateTime PaidAt { get; set; }
    }
}
