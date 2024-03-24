using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Models;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{
    [Authorize]
    [Route("Ref")]
    public class RefController : BaseController
    {
        private readonly IRefService _refServices;
        private readonly ILogger<RefController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public RefController(
            ILogger<RefController> logger,
            IMapper mapper,
            IRefService refServices,
            IOptions<AppSettings> appSettings)
        {
            _refServices = refServices;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("Encrypt")]
        public Task<string> Encrypt(string text)
        {

            string en = EncryptionHelper.Encrypt(text, Constants.PassDecryptKey);
            string de  = EncryptionHelper.Decrypt(en, Constants.PassDecryptKey);
            return Task.FromResult(en + "---" + de );
        }
        
  

    }
}
