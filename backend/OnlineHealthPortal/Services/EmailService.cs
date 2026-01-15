using System.Net;
using System.Net.Mail;

namespace OnlineHealthPortal.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var smtp = _config.GetSection("Smtp");

            var client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"]))
            {
                Credentials = new NetworkCredential(smtp["Username"], smtp["Password"]),
                EnableSsl = true
            };

            var mail = new MailMessage(smtp["From"], to, subject, body);

            await client.SendMailAsync(mail);
        }
    }


}
