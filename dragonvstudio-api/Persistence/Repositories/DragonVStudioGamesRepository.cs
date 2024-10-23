using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks; 
using Microsoft.EntityFrameworkCore; 
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Collections.Generic;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class DragonVStudioGamesRepository : IDragonVStudioGamesRepository
    {
        protected readonly DragonVContext _context;
        private readonly ILogger<AdminGameServerRepository> _logger;
        public DragonVStudioGamesRepository(DragonVContext context, ILogger<AdminGameServerRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> request)
        {
            try
            {
                return (await _context.GameServer.AsNoTracking()
                    .Where(g => g.GameUrl.Equals(request.GameUrl))
                    .FirstOrDefaultAsync()
                     , ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameInfor method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }
         
        public async Task<(List<GameServerList>, ResultCode)> GetGameServerList(BaseGameRequest<GameServerInforRequest> request)
        {
            try
            {
                return (await _context.GameServerLists.AsNoTracking()
                    .Where(g => g.GameUrl.Equals(request.GameUrl))
                    .ToListAsync()
                     , ResultCode.Success); 
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameServerList method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        } 
    }
}
