using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using System.Threading.Tasks;
using System;
using DragonVStudio.API.Domain.Entities;
using System.Collections.Generic;

namespace DragonVStudio.API.Domain.Services
{
    public interface IDragonVStudioGamesService
    {
        Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> baseGameRequest);
        Task<(List<GameServerList>, ResultCode)> GetGameServerList(BaseGameRequest<GameServerInforRequest> request);

    }
}
