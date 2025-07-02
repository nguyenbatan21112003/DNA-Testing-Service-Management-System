using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Mail
{
    public class MailSettings
    {
        public string FromAddress { get; set; }
        public string AppPassword { get; set; }
        public int Port { get; set; }
        public string SmtpServer { get; set; }
    }

}
