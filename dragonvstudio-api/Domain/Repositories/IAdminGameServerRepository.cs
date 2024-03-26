using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Response;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IAdminGameServerRepository
    {
        Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> baseGameRequest);
    }
}
