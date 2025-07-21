using DNATestSystem.BusinessObjects.Application.Dtos.Mail;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DNATestSystem.Services.Service;
using DNATestSystem.Services.Interface;

namespace DNATestSystem.APIService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MailController : ControllerBase
    {
        private readonly MailSettings _mailSettings;
        private readonly MailgunService _mailgunService;
        private readonly IMailService _mailService;
        public MailController(IOptions<MailSettings> mailOptions, MailgunService mailgunService
                              , IMailService mailService)
        {
            _mailSettings = mailOptions.Value;
            _mailgunService = mailgunService;
            _mailService = mailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMail([FromBody] SendMailDto dto)
        {
            var result = await _mailService.SendMailAsync(dto);
            return result ? Ok("Email sent successfully.") : StatusCode(500, "Failed to send email.");
        }
        //[HttpPost("send-gun-mail")]

        //public async Task<IActionResult> SendMail([FromBody] SendMailGunDto dto)
        //{
        //    var success = await _mailgunService.SendEmailAsync(dto);
        //    return success ? Ok("Email sent successfully.") : StatusCode(500, "Email sending failed.");
        //}
    }
}
