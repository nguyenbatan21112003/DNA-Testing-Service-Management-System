using DNATestSystem.BusinessObjects.Application.Dtos.Mail;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MailController : ControllerBase
    {
        private readonly MailSettings _mailSettings;

        public MailController(IOptions<MailSettings> mailOptions)
        {
            _mailSettings = mailOptions.Value;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMail([FromBody] SendMailDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ToAddress))
                return BadRequest("ToAddress is required");

            var mail = new MailMessage
            {
                From = new MailAddress(_mailSettings.FromAddress),
                Subject = dto.Subject,
                Body = dto.Body,
                IsBodyHtml = false
            };

            mail.To.Add(dto.ToAddress);

            using (var smtp = new SmtpClient("smtp.gmail.com", 587))
            {
                smtp.Credentials = new NetworkCredential(_mailSettings.FromAddress, _mailSettings.AppPassword);
                smtp.EnableSsl = true;

                await smtp.SendMailAsync(mail);
            }

            return Ok("Mail sent successfully");
        }
    }
}
