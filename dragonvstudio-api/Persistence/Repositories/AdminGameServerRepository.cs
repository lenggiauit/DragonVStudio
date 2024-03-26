using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Extensions;
using DragonVStudio.API.Resources.Game;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class AdminGameServerRepository : IAdminGameServerRepository
    {
        protected readonly DragonVContext _context;
        private readonly ILogger<AdminGameServerRepository> _logger;
        public AdminGameServerRepository(DragonVContext context, ILogger<AdminGameServerRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> baseGameRequest)
        {
            try
            { 
                return (await _context.GameServer.AsNoTracking()
                    .Where(g => g.GameUrl.Equals(baseGameRequest.GameUrl))
                    .FirstOrDefaultAsync() 
                     ,ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameInfor method: " + ex.Message);
                return (null,  ResultCode.Error);
            }
        }
    }
}
