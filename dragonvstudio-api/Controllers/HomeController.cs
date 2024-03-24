using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    [ApiController]
    public class HomeController : BaseController
    {
        private readonly IHomeService _homeServices;
        private readonly ILogger<HomeController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public HomeController(
            IHomeService homeServices,
            ILogger<HomeController> logger,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _homeServices = homeServices;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;

        }

        [HttpGet("getYoutubevideos")]
        public async Task<BaseResponse<List<YoutubeVideoResource>>> GetYoutubevideos()
        {
             
            var (data, resultCode) = await _homeServices.GetYoutubeVideos();
            if (data != null)
            {
                return new BaseResponse<List<YoutubeVideoResource>>(_mapper.Map<List<YoutubeVideo>, List<YoutubeVideoResource>>(data));
            }
            else
            {
                return new BaseResponse<List<YoutubeVideoResource>>(Constants.ErrorMsg, resultCode);
            }
             
        }


    }
}