using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.Mail;
using Microsoft.Extensions.Options;

namespace DNATestSystem.Services.Service
{
    public class MailgunService
    {
        private readonly MailGunSetting _settings;
        private readonly HttpClient _http;

        public MailgunService(IOptions<MailGunSetting> options, HttpClient httpClient)
        {
            _settings = options.Value;
            _http = httpClient;
        }

        public async Task<bool> SendEmailAsync(SendMailGunDto dto)
        {
            var request = new HttpRequestMessage(HttpMethod.Post,
                $"https://api.mailgun.net/v3/{_settings.Domain}/messages");

            var auth = Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{_settings.ApiKey}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);

            request.Content = new FormUrlEncodedContent(new[]
            {
        new KeyValuePair<string, string>("from", _settings.FromAddress),
        new KeyValuePair<string, string>("to", dto.To),
        new KeyValuePair<string, string>("subject", dto.Subject),
        new KeyValuePair<string, string>("text", dto.Body)
    });

            var response = await _http.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[Mailgun Error] Status: {response.StatusCode}");
                Console.WriteLine($"[Mailgun Error] Content: {errorContent}");
            }

            return response.IsSuccessStatusCode;
        }

    }

}
