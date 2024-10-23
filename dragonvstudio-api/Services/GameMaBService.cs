using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Request.Player;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class GameMaBService : IGameMaBService
    {
        private readonly IGameMaBRepository _gameRepository;
        private readonly INotificationRepository _notifyRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<GameMaBService> _logger;

        public GameMaBService(IGameMaBRepository gameRepository, INotificationRepository notificationRepository, IEmailService emailService,
            ILogger<GameMaBService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _gameRepository = gameRepository;
            _notifyRepository = notificationRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings)
        {
            return await _gameRepository.GetGameItems(userId, request, discordRoles, maBGameSettings);
        }

        public async Task<(List<UserGameItems>, int, ResultCode)> GetPlayerGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _gameRepository.GetPlayerGameItems(userId, request, maBGameSettings);
        }

        public async Task<(Player, ResultCode)> GetPlayerInfo(BaseGameRequest<PlayerInfoRequest> request)
        {
            return await _gameRepository.GetPlayerInfo(request);
        }

        public async Task<ResultCode> PlayerBuyGameItem(Guid userId, BaseGameRequest<PlayerBuyGameItemRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings)
        {
            return await _gameRepository.PlayerBuyGameItem(userId, request, discordRoles, maBGameSettings);
        }

        public async Task<ResultCode> PlayerDeleteItem(Guid userId, BaseGameRequest<PlayerDeleteItemRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _gameRepository.PlayerDeleteItem(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> PlayerEquipItem(Guid userId, BaseGameRequest<PlayerEquipItemRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _gameRepository.PlayerEquipItem(userId, request, maBGameSettings);
        }
    }
}
