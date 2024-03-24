using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using System;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly AppSettings _appSettings;

        public EmailService(ILogger<EmailService> logger, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        public async Task Send(string from, string to, string subject, string content, string smtpPwd)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(from));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = content + _appSettings.MailSignature };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings.SmtpHost, _appSettings.SmtpPort, SecureSocketOptions.SslOnConnect);
            //string pwd = Utilities.Decrypt(_appSettings.SmtpPass, "DragonVStudio_email_key6385937");
            smtp.Authenticate(_appSettings.SmtpUser, smtpPwd);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }

        public async Task Send(string to, string subject, string content, string smtpPwd)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_appSettings.MailSender));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = content + _appSettings.MailSignature };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_appSettings.SmtpHost, _appSettings.SmtpPort, SecureSocketOptions.None);
            try
            {
                 
                smtp.Authenticate(_appSettings.SmtpUser, smtpPwd);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch(Exception e)
            {
                _logger.LogError("Error at Send Email: " + e.Message);
            }
           
        }
    }
}
