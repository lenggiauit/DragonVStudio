using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IDragonVStudioGamesRepository
    {
        Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> request);
        Task<(List<GameServerList>, ResultCode)> GetGameServerList(BaseGameRequest<GameServerInforRequest> request);
    }
}
