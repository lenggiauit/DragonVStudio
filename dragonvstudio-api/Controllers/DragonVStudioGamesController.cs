using AutoMapper;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources.Game;
using DragonVStudio.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    [ApiController]
    public class DragonVStudioGamesController : BaseController
    {
        private readonly IDragonVStudioGamesService _dragonVStudioGamesServiceServices;
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<DragonVStudioGamesController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public DragonVStudioGamesController(
            ILogger<DragonVStudioGamesController> logger,
            IMapper mapper,
            IDragonVStudioGamesService dragonVStudioGamesServiceServices,
            IHttpClientFactoryService httpClientFactoryService,
            IOptions<AppSettings> appSettings)
        {
            _dragonVStudioGamesServiceServices = dragonVStudioGamesServiceServices;
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [HttpPost("GetGameInfor")]
        public async Task<BaseResponse<GameServerResource>> GetGameInfor([FromBody] BaseGameRequest<GameServerInforRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _dragonVStudioGamesServiceServices.GetGameInfor(request);
                if (data != null)
                {
                    return new BaseResponse<GameServerResource>(_mapper.Map<GameServer, GameServerResource>(data));
                }
                else
                {
                    return new BaseResponse<GameServerResource>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<GameServerResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetGameServerList")]
        public async Task<BaseResponse<List<GameServerListResource>>> GetGameServerList([FromBody] BaseGameRequest<GameServerInforRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _dragonVStudioGamesServiceServices.GetGameServerList(request);
                if (data != null)
                {
                    return new BaseResponse<List<GameServerListResource>>(_mapper.Map<List<GameServerList>, List<GameServerListResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<GameServerListResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<GameServerListResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }



    } 

}
