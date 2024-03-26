using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IAdminGameMaBRepository
    {
        Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request);
        Task<(List<Player>, int, ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request);
        Task<(List<Log>, int, ResultCode)> GetPlayersLogs(BaseGameRequest<PlayerLogRequest> request);
        Task<(List<BattleEventPlayer>, ResultCode)> GetSavedPlayersEvent(BaseGameRequest<PlayerFilterRequest> request);
        Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
    }
}
