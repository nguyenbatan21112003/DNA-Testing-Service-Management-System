using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.Mail
{
    public class MailGunSetting
    {
        public string ApiKey { get; set; }
        public string Domain { get; set; }
        public string FromAddress { get; set; }
    }
}
