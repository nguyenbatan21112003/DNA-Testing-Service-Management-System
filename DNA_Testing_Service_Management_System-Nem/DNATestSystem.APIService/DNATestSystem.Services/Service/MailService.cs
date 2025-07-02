using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Mail;
using Microsoft.Extensions.Options;
using DNATestSystem.Services.Interface;

public class MailService : IMailService
{
    private readonly MailSettings _mailSettings;

    public MailService(IOptions<MailSettings> mailOptions)
    {
        _mailSettings = mailOptions.Value;
    }
    public async Task SendMailAsync(SendMailDto dto)
    {
        var mail = new MailMessage
        {
            From = new MailAddress(_mailSettings.FromAddress),
            Subject = dto.Subject,
            Body = dto.Body,
            IsBodyHtml = false
        };
        mail.To.Add(dto.ToAddress);

        var smtp = new SmtpClient("smtp.gmail.com", 587)
        {
            Credentials = new NetworkCredential(_mailSettings.FromAddress, _mailSettings.AppPassword),
            EnableSsl = true
        };

        await smtp.SendMailAsync(mail);
    }
}

