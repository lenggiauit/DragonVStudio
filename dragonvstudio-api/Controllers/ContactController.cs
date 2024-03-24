using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Response;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{
    [Route("[controller]")]  
    public class ContactController : ControllerBase
    { 
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public ContactController(ILogger<ContactController> logger, 
            IEmailService emailService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _logger = logger; 
            _emailService = emailService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("SendContact")]
        public Task<BaseResponse<ResultCode>> SendContact([FromBody] BaseRequest<ContactRequest> request)
        {
            if (ModelState.IsValid)
            {
                string smtpPwd = EncryptionHelper.Decrypt(_appSettings.SmtpPass, Constants.PassDecryptKey);
                
                _emailService.Send(_appSettings.MailAdmin,
                   request.Payload.YourName,
                    string.Format(_appSettings.MailDefaultContent,  
                    request.Payload.YourName, request.Payload.YourEmail, 
                    request.Payload.YourMessage.Replace("\n", "<br />")
                    ), smtpPwd);

                return Task.FromResult(new BaseResponse<ResultCode>(resultCode:  ResultCode.Success));
            }
            else
            {
                return Task.FromResult(new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid));
            }

        }
    }
}
