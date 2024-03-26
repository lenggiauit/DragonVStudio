using DragonVStudio.API.Domain.Entities;
using System.Threading.Tasks;
using System;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System.Collections.Generic;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;

namespace DragonVStudio.API.Domain.Services
{
    public interface IAdminGameMaBService
    {
        Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request); 
        Task<(List<Player>, int , ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request);
        Task<(List<Log>, int, ResultCode)> GetPlayersLogs(BaseGameRequest<PlayerLogRequest> request);
        Task<(List<BattleEventPlayer> , ResultCode)> GetSavedPlayersEvent(BaseGameRequest<PlayerFilterRequest> request);
        Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
    }
}
