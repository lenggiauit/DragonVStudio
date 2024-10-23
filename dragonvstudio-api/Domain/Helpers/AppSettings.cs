using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string SubFolder { get; set; }
        public string MailSender { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUser { get; set; }
        public string SmtpPass { get; set; }
        public string MailSignature { get; set; }
        public string MailDefaultSubject { get; set; }
        public string MailDefaultContent { get; set; }
        public string GoogleApisUrl { get; set; }

        public string DiscordApisUrl { get; set; } 
        public string DiscordGuildApi {  get; set; }    

        public string FacebookApisUrl { get; set; }
        public string MailForgotPasswordSubject { get; set; }
        public string MailForgotPasswordContent { get; set; } 
        public string ForgotPasswordUrl { get; set; }
        public string ClientErrorMappingUrl { get; set; }
        public string FileFolderPath { get; set; } 
        public string[] TemplateSupportExtension { get; set; }
        public string FileRequestUrl { get; set; }
        public string TemplateRequestUrl { get; set; }
        public string AllowOriginUrl { get; set; }
        public string AllowOriginUrl1 { get; set; }
        public string AllowOriginUrl2 { get; set; }
        public string AllowOriginUrl3 { get; set; }
        public string AllowOriginUrl4 { get; set; } 
        public int DefaultPageSize { get; set; }

        public string YoutubeAPIUrl { get; set; }
        public string YoutubeChannelId { get; set; }
        public string YoutubeAPIKey { get; set; }

        public int BookingAdjustmentDay { get; set; }
        public string SiteName { get; set; } 
        public string MailAdmin { get; set; }

        public string DiscordClientId { get; set; }

        public string DiscordClientSecret { get; set; } 
        public string DiscordAuthenticationUrl { get; set; }
        public string DiscordAuthenticationRedirectUrl { get; set; }

        public string DiscordAuthenticationRedirectRegiterUrl { get; set; }
        public string DiscordTokenUrl { get; set; }
        public string DiscordCallbackUrl { get; set; }

        public string DiscordAuthenticationLoginRedirectUrl { get; set; }   

        public string DiscordCDNUrl { get; set; }

        public string ConnectWithDiscordRedirectUrl {  get; set; }

        public string ConnectWithDiscordClientRedirectUrl { get; set; }
         
        public List<DiscordRole> DiscordGuildRoles { get; set; } 

    }


    public class DiscordRole
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

}
