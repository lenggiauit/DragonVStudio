using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class AdminGameMaBService : IAdminGameMaBService
    {
        private readonly IAdminGameMaBRepository _adminGameRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<AdminGameMaBService> _logger;

        public AdminGameMaBService(IAdminGameMaBRepository adminGameRepository, IEmailService emailService, 
            ILogger<AdminGameMaBService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _adminGameRepository = adminGameRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AssignTeamsToBattleEvent(request, maBGameSettings);
        }

        public async Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request)
        {
            return await _adminGameRepository.GetPlayerListForEvent(request);
        }

        public async Task<(List<Player>, int, ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request)
        {
            return await _adminGameRepository.GetPlayersList(request);
        }

        public async Task<(List<Log>, int, ResultCode)> GetPlayersLogs(BaseGameRequest<PlayerLogRequest> request)
        {
            return await _adminGameRepository.GetPlayersLogs(request);
        }

        public async Task<(List<BattleEventPlayer>, ResultCode)> GetSavedPlayersEvent(BaseGameRequest<PlayerFilterRequest> request)
        {
            return await _adminGameRepository.GetSavedPlayersEvent(request);
        }

        public async Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.SavePlayersEvent(request, maBGameSettings);
        }
    }
}
