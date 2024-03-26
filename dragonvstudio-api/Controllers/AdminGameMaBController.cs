using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;
using DragonVStudio.API.Services;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Resources.Game;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;

namespace DragonVStudio.API.Controllers
{
    //[Authorize]
    [Route("[controller]")]
    public class AdminGameMaBController : BaseController
    {
        private readonly IAdminGameMaBService _adminGameMaBServices;
        private readonly IAdminGameServerService _adminGameServerService;
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<AdminGameMaBController> _logger;
        private readonly AppSettings _appSettings;
        private readonly MaBGameSettings _maBGameSettings;
        private IMapper _mapper;
        public AdminGameMaBController(
            ILogger<AdminGameMaBController> logger,
            IMapper mapper,
            IAdminGameServerService adminGameServerService,
            IAdminGameMaBService adminGameMaBService,
            IHttpClientFactoryService httpClientFactoryService,
                IOptions<AppSettings> appSettings,
                 IOptions<MaBGameSettings> maBGameSettings)
        {
            _adminGameServerService = adminGameServerService;
            _adminGameMaBServices = adminGameMaBService;
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _maBGameSettings = maBGameSettings.Value;
        }

        // [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetGameInfor")]
        public async Task<BaseResponse<GameServerResource>> GetGameInfor([FromBody] BaseGameRequest<GameServerInforRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data,  resultCode) = await _adminGameServerService.GetGameInfor(request);
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


        [Permissions(PermissionConstant.ManagePlayer)] 
        [HttpPost("GetPlayerList")]
        public async Task<BaseResponse<List<PlayerResource>>> GetPlayerList([FromBody]BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetPlayersList(request);
                if (data != null)
                {
                    return new BaseResponse<List<PlayerResource>>(_mapper.Map<List<Player>, List<PlayerResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<PlayerResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<PlayerResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetPlayerListForEvent")]
        public async Task<BaseResponse<List<PlayerEventResource>>> GetPlayerListForEvent([FromBody] BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _adminGameMaBServices.GetPlayerListForEvent(request);
                if (data != null)
                {
                    return new BaseResponse<List<PlayerEventResource>>(_mapper.Map<List<Player>, List<PlayerEventResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<PlayerEventResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<PlayerEventResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetPlayerLogs")]
        public async Task<BaseResponse<List<LogResource>>> GetPlayerLogs([FromBody] BaseGameRequest<PlayerLogRequest> request)
        {
            if (ModelState.IsValid)
            {
                var(data, total, resultCode) = await _adminGameMaBServices.GetPlayersLogs(request);
                if (data != null)
                {
                    return new BaseResponse<List<LogResource>>(_mapper.Map<List<Log>, List<LogResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<LogResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<LogResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("SavePlayersEvent")]
        public async Task<BaseResponse<ResultCode>> SavePlayersEvent([FromBody] BaseGameRequest<EventPlayersRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.SavePlayersEvent(request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
               
            }
            else
            {
                return new BaseResponse<ResultCode>(ResultCode.Error);
            }
        }
        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("AssignTeamsToBattleEvent")]
        public async Task<BaseResponse<ResultCode>> AssignTeamsToBattleEvent([FromBody] BaseGameRequest<EventPlayersRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AssignTeamsToBattleEvent(request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);

            }
            else
            {
                return new BaseResponse<ResultCode>(ResultCode.Error);
            }
        }

        

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetSavedPlayersEvent")]
        public async Task<BaseResponse<List<PlayerEventResource>>> GetSavedPlayersEvent([FromBody] BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _adminGameMaBServices.GetSavedPlayersEvent(request);
                if (data != null)
                {
                    return new BaseResponse<List<PlayerEventResource>>(_mapper.Map<List<BattleEventPlayer>, List<PlayerEventResource>>(data));
                }
                else
                { 
                    return new BaseResponse<List<PlayerEventResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            { 
                return new BaseResponse<List<PlayerEventResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }




    }
}
