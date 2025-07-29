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
using MimeKit;
using MailKit.Net.Smtp;
using MimeKit;
public class MailService : IMailService
{
    private readonly MailSettings _mailSettings;
    
    public MailService(IOptions<MailSettings> mailOptions)
    {
        _mailSettings = mailOptions.Value;
    }
    //public async Task SendMailAsync(SendMailDto dto)
    //{
    //    var mail = new MailMessage
    //    {
    //        From = new MailAddress(_mailSettings.FromAddress),
    //        Subject = dto.Subject,
    //        Body = dto.Body,
    //        IsBodyHtml = false
    //    };
    //    mail.To.Add(dto.ToAddress);

    //    var smtp = new SmtpClient("smtp.gmail.com", 587)
    //    {
    //        Credentials = new NetworkCredential(_mailSettings.FromAddress, _mailSettings.AppPassword),
    //        EnableSsl = true
    //    };

    //    await smtp.SendMailAsync(mail);
    //}


    public async Task<bool> SendMailAsync(SendMailDto dto)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("", _mailSettings.FromAddress));
        message.To.Add(new MailboxAddress("", dto.ToAddress));
        message.Subject = dto.Subject;

        message.Body = new TextPart("html")
        {
            Text = dto.Body
        };

        using var client = new MailKit.Net.Smtp.SmtpClient();
        try
        {
            await client.ConnectAsync(_mailSettings.SmtpServer, _mailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_mailSettings.FromAddress, _mailSettings.AppPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Email Error] {ex.Message}");
            return false;
        }
    }
}

