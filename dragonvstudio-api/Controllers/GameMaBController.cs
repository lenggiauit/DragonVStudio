using AutoMapper;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Request.Player;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources.Game;
using DragonVStudio.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{ 
    [Authorize]
    [Route("[controller]")]
    public class GameMaBController : BaseController
    {
        private readonly IGameMaBService _gameMaBServices; 
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<GameMaBController> _logger;
        private readonly AppSettings _appSettings;
        private readonly MaBGameSettings _maBGameSettings;
        private IMapper _mapper;
        public GameMaBController(
            ILogger<GameMaBController> logger,
            IMapper mapper, 
            IGameMaBService gameMaBService,
            IHttpClientFactoryService httpClientFactoryService,
                IOptions<AppSettings> appSettings,
                 IOptions<MaBGameSettings> maBGameSettings)
        { 
            _gameMaBServices = gameMaBService;
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _maBGameSettings = maBGameSettings.Value;
        }

        [HttpPost("GetPlayerInfo")]
        public async Task<BaseResponse<PlayerResource>> GetPlayerInfo([FromBody] BaseGameRequest<PlayerInfoRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _gameMaBServices.GetPlayerInfo(request);
                if (data != null)
                {
                    return new BaseResponse<PlayerResource>(_mapper.Map<Player, PlayerResource>(data));
                }
                else
                {
                    return new BaseResponse<PlayerResource>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<PlayerResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetShopGameItems")]
        public async Task<BaseResponse<List<GameItemResource>>> GetShopGameItems([FromBody] BaseGameRequest<GameItemFilterRequest> request)
        {
            if (ModelState.IsValid)
            { 
                if(GetCurrentUser().DiscordRoles.Any(r => _appSettings.DiscordGuildRoles.Any(y => y.Id.Equals(r))))
                {
                    var (data, total, resultCode) = await _gameMaBServices.GetGameItems(GetCurrentUserId(), request, GetCurrentUser().DiscordRoles, _maBGameSettings);
                    if (data != null)
                    {
                        return new BaseResponse<List<GameItemResource>>(_mapper.Map<List<GameItem>, List<GameItemResource>>(data), total);
                    }
                    else
                    {
                        return new BaseResponse<List<GameItemResource>>(Constants.InvalidMsg, resultCode);
                    }
                }
                else
                {
                    return new BaseResponse<List<GameItemResource>>(new List<GameItemResource>(), ResultCode.Success);
                } 

            }
            else
            {
                return new BaseResponse<List<GameItemResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("PlayerBuyGameItem")]
        public async Task<BaseResponse<ResultCode>> PlayerBuyGameItem([FromBody] BaseGameRequest<PlayerBuyGameItemRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _gameMaBServices.PlayerBuyGameItem(GetCurrentUserId(), request, GetCurrentUser().DiscordRoles, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetPlayerGameItems")]
        public async Task<BaseResponse<List<UserGameItemsResource>>> GetPlayerGameItems([FromBody] BaseGameRequest<GameItemFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _gameMaBServices.GetPlayerGameItems(GetCurrentUserId(), request, _maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<UserGameItemsResource>>(_mapper.Map<List<UserGameItems>, List<UserGameItemsResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<UserGameItemsResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<UserGameItemsResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("PlayerEquipItem")]
        public async Task<BaseResponse<ResultCode>> PlayerEquipItem([FromBody] BaseGameRequest<PlayerEquipItemRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _gameMaBServices.PlayerEquipItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("PlayerDeleteItem")]
        public async Task<BaseResponse<ResultCode>> PlayerDeleteItem([FromBody] BaseGameRequest<PlayerDeleteItemRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _gameMaBServices.PlayerDeleteItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }



    }
}
