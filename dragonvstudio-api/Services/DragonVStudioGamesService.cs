using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class DragonVStudioGamesService : IDragonVStudioGamesService
    {
        private readonly IDragonVStudioGamesRepository _dragonVStudioGamesRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<DragonVStudioGamesService> _logger;

        public DragonVStudioGamesService(IDragonVStudioGamesRepository dragonVStudioGamesRepository, IEmailService emailService,
            ILogger<DragonVStudioGamesService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _dragonVStudioGamesRepository = dragonVStudioGamesRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }
        public async Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> baseGameRequest)
        {
            return await _dragonVStudioGamesRepository.GetGameInfor(baseGameRequest);
        }

        public async Task<(List<GameServerList>, ResultCode)> GetGameServerList(BaseGameRequest<GameServerInforRequest> request)
        {
            return await _dragonVStudioGamesRepository.GetGameServerList(request);
        }
    }
}
