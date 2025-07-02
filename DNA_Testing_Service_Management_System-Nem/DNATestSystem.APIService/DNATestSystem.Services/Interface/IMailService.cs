using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Mail;

namespace DNATestSystem.Services.Interface
{
    public interface IMailService
    {
        Task SendMailAsync(SendMailDto dto);
    }
}
