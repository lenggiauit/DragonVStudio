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
using DragonVStudio.API.Services;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Resources.Game;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
 

namespace DragonVStudio.API.Controllers
{
    [Authorize]
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

        [Permissions(PermissionConstant.ManagePlayer)]
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
        [HttpPost("AssignPlayerToPrison")]
        public async Task<BaseResponse<ResultCode>> AssignPlayerToPrison([FromBody] BaseGameRequest<PlayerActionRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AssignPlayerToPrison(request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);

            }
            else
            {
                return new BaseResponse<ResultCode>(ResultCode.Error);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("AssignPlayerBackToPreviousRoleAndfaction")]
        public async Task<BaseResponse<ResultCode>> AssignPlayerBackToPreviousRoleAndfaction([FromBody] BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AssignPlayerBackToPreviousRoleAndfaction(request, _maBGameSettings);
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


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetBannedPlayers")]
        public async Task<BaseResponse<List<BannedPlayerResource>>> GetBannedPlayers([FromBody] BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total ,resultCode) = await _adminGameMaBServices.GetBannedPlayers(request, _maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<BannedPlayerResource>>(_mapper.Map<List<BannedPlayer>, List<BannedPlayerResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<BannedPlayerResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<BannedPlayerResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("BanPlayer")]
        public async Task<BaseResponse< ResultCode>> BanPlayer([FromBody] BaseGameRequest<BanPlayerRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.BanPlayer(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode); 
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("UnbanPlayer")]
        public async Task<BaseResponse<ResultCode>> UnbanPlayer([FromBody] BaseGameRequest<UnbanPlayerRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.UnbanPlayer(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetGameItems")]
        public async Task<BaseResponse<List<GameItemResource>>> GetGameItems([FromBody] BaseGameRequest<GameItemFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetGameItems(GetCurrentUserId(), request, _maBGameSettings);
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
                return new BaseResponse<List<GameItemResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("AddEditGameItem")]
        public async Task<BaseResponse<ResultCode>> AddEditGameItem([FromBody] BaseGameRequest<AddEditGameItemRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AddEditGameItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("DeleteGameItem")]
        public async Task<BaseResponse<ResultCode>> DeleteGameItem([FromBody] BaseGameRequest<GameItemActionRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.DeleteGameItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetPlayersHasItem")]
        public async Task<BaseResponse<List<PlayerHasItemsResource>>> GetPlayersHasItem([FromBody] BaseGameRequest<PlayerFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetPlayersHasItem(request, _maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<PlayerHasItemsResource>>(_mapper.Map<List<Player>, List<PlayerHasItemsResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<PlayerHasItemsResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<PlayerHasItemsResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("DeletePLayerGameItem")]
        public async Task<BaseResponse<ResultCode>> DeletePLayerGameItem([FromBody] BaseGameRequest<GameItemActionRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.DeletePLayerGameItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("AssignItemToPlayer")]
        public async Task<BaseResponse<ResultCode>> AssignItemToPlayer([FromBody] BaseGameRequest<GameItemActionRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AssignItemToPlayer(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetGachaItems")]
        public async Task<BaseResponse<List<GachaItemsResource>>> GetGachaItems([FromBody] BaseGameRequest<GachaItemFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetGachaItems(request, _maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<GachaItemsResource>>(_mapper.Map<List<GachaItem>, List<GachaItemsResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<GachaItemsResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<GachaItemsResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetGachaItemsForEvent")]
        public async Task<BaseResponse<List<GachaItemsResource>>> GetGachaItemsForEvent([FromBody] BaseGameRequest<GachaItemFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetGachaItemsForEvent(request, _maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<GachaItemsResource>>(_mapper.Map<List<GachaItem>, List<GachaItemsResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<GachaItemsResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<GachaItemsResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("AddEditGachaItem")]
        public async Task<BaseResponse<ResultCode>> AddEditGachaItem([FromBody] BaseGameRequest<AddEditGachaItemRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.AddEditGachaItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("DeleteGachaItem")]
        public async Task<BaseResponse<ResultCode>> DeleteGachaItem([FromBody] BaseGameRequest<GameItemActionRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.DeleteGachaItem(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("ChangePlayerName")]
        public async Task<BaseResponse<ResultCode>> ChangePlayerName([FromBody] BaseGameRequest<ChangePlayerNameRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.ChangePlayerName(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }



        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("TakePlayerMoney")]
        public async Task<BaseResponse<ResultCode>> TakePlayerMoney([FromBody] BaseGameRequest<PlayerMoneyRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.TakePlayerMoney(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GivePlayerMoney")]
        public async Task<BaseResponse<ResultCode>> GivePlayerMoney([FromBody] BaseGameRequest<PlayerMoneyRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.GivePlayerMoney(GetCurrentUserId(), request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        //[Permissions(PermissionConstant.ManagePlayer)]
        //[HttpPost("AddPlayerWarning")]
        //public async Task<BaseResponse<ResultCode>> AddPlayerWarning([FromBody] BaseGameRequest<AddPlayerWarningRequest> request)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var resultCode = await _adminGameMaBServices.AddPlayerWarning(GetCurrentUserId(), request, _maBGameSettings);
        //        return new BaseResponse<ResultCode>(resultCode);
        //    }
        //    else
        //    {
        //        return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        //    }
        //}

        //[Permissions(PermissionConstant.ManagePlayer)]
        //[HttpPost("CompensatePlayer")]
        //public BaseResponse<ResultCode> CompensatePlayer([FromBody] BaseGameRequest<CompensatePlayerRequest> request)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var communicator = GameNetwork.NetworkPeers.Where(gn => gn.VirtualPlayer.Id.Equals(request.Payload.PlayerId) && gn.IsConnectionActive).FirstOrDefault();
        //        if (communicator != null)
        //        {
        //            PersistentEmpireRepresentative persistentEmpireRepresentative = communicator.GetComponent<PersistentEmpireRepresentative>();
        //            if (persistentEmpireRepresentative != null)
        //            {
        //                if (request.Payload.Gold > 0)
        //                {
        //                    persistentEmpireRepresentative.GoldGain(request.Payload.Gold);
        //                }
        //                else
        //                {
        //                    persistentEmpireRepresentative.GoldLost(request.Payload.Gold * -1);
        //                }
        //                return new BaseResponse<ResultCode>(ResultCode.Success);

        //            }
        //            else
        //            {
        //                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        //            }

        //        }
        //        else
        //        {
        //            return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        //        }

        //    }
        //    else
        //    {
        //        return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        //    }
        //}


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("GetPersonalProperty")]
        public async Task<BaseResponse<List<PersonalPropertyResource>>> GetPersonalProperty()
        {
            if (ModelState.IsValid)
            {
                var (data, total, resultCode) = await _adminGameMaBServices.GetPersonalProperty(_maBGameSettings);
                if (data != null)
                {
                    return new BaseResponse<List<PersonalPropertyResource>>(_mapper.Map<List<PersonalProperties>, List<PersonalPropertyResource>>(data), total);
                }
                else
                {
                    return new BaseResponse<List<PersonalPropertyResource>>(Constants.InvalidMsg, resultCode);
                }

            }
            else
            {
                return new BaseResponse<List<PersonalPropertyResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManagePlayer)]
        [HttpPost("UpdatePersonalProperty")]
        public async Task<BaseResponse<ResultCode>> UpdatePersonalProperty([FromBody] BaseGameRequest<PersonalPropertyRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _adminGameMaBServices.UpdatePersonalProperty(request, _maBGameSettings);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            } 
             
        }
         

    }
}
