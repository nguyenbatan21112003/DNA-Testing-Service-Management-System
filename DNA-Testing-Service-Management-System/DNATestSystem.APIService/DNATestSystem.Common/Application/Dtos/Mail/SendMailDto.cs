using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Mail
{
    public class SendMailDto
    {
        public string ToAddress { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }       
    }
}
