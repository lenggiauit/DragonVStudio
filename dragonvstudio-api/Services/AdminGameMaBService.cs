using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class AdminGameMaBService : IAdminGameMaBService
    {
        private readonly IAdminGameMaBRepository _adminGameRepository;
        private readonly INotificationRepository _notifyRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<AdminGameMaBService> _logger;

        public AdminGameMaBService(IAdminGameMaBRepository adminGameRepository, INotificationRepository notificationRepository, IEmailService emailService, 
            ILogger<AdminGameMaBService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _adminGameRepository = adminGameRepository;
            _notifyRepository = notificationRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<ResultCode> AddEditGachaItem(Guid userId, BaseGameRequest<AddEditGachaItemRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AddEditGachaItem(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> AddEditGameItem(Guid userId, BaseGameRequest<AddEditGameItemRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AddEditGameItem(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> AssignItemToPlayer(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AssignItemToPlayer(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> AssignPlayerBackToPreviousRoleAndfaction(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AssignPlayerBackToPreviousRoleAndfaction(request, maBGameSettings);
        }

        public async Task<ResultCode> AssignPlayerToPrison(BaseGameRequest<PlayerActionRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AssignPlayerToPrison(request, maBGameSettings);
        }

        public async Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.AssignTeamsToBattleEvent(request, maBGameSettings);
        }

        public async Task<ResultCode> BanPlayer(Guid userId, BaseGameRequest<BanPlayerRequest> request, MaBGameSettings maBGameSettings)
        { 
            var result = await _adminGameRepository.BanPlayer(userId, request, maBGameSettings);
            if (result == ResultCode.Success)
            {
                if (request.Payload.UserId != Guid.Empty)
                {
                    await _notifyRepository.SendNotification("[BannedPlayer]", request.Payload.UserId); 
                }
                return ResultCode.Success;
            }
            else
            {
                return ResultCode.Error;
            }  
        }

        public async Task<ResultCode> ChangePlayerName(Guid userId, BaseGameRequest<ChangePlayerNameRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.ChangePlayerName(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> DeleteGachaItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.DeleteGachaItem(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> DeleteGameItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.DeleteGameItem(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> DeletePLayerGameItem(Guid userID, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.DeletePLayerGameItem(userID, request, maBGameSettings);
        }

        public async Task<(List<BannedPlayer>, int, ResultCode)> GetBannedPlayers(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetBannedPlayers(request, maBGameSettings);
        }

        public async Task<(List<GachaItem>, int, ResultCode)> GetGachaItems(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetGachaItems(request, maBGameSettings);
        }

        public async Task<(List<GachaItem>, int, ResultCode)> GetGachaItemsForEvent(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetGachaItemsForEvent(request, maBGameSettings);
        }

        public async Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetGameItems(userId, request, maBGameSettings);
        }

        public async Task<(List<PersonalProperties>, int, ResultCode)> GetPersonalProperty(MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetPersonalProperty(maBGameSettings);
        }

        public async Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request)
        {
            return await _adminGameRepository.GetPlayerListForEvent(request);
        }

        public async Task<(List<Player>, int, ResultCode)> GetPlayersHasItem(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GetPlayersHasItem(request, maBGameSettings);
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

        public async Task<ResultCode> GivePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.GivePlayerMoney(userId, request, maBGameSettings);
        }

        public async Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.SavePlayersEvent(request, maBGameSettings);
        }

        public async Task<ResultCode> TakePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.TakePlayerMoney(userId, request, maBGameSettings); 
        }

        public async Task<ResultCode> UnbanPlayer(Guid userId, BaseGameRequest<UnbanPlayerRequest> request, MaBGameSettings maBGameSettings)
        {
            var result = await _adminGameRepository.UnbanPlayer(userId, request, maBGameSettings);
            if (result == ResultCode.Success)
            {
                if (request.Payload.UserId != Guid.Empty)
                {
                    await _notifyRepository.SendNotification("[UnbannedPlayer]", request.Payload.UserId);
                }
                return ResultCode.Success;
            }
            else
            {
                return ResultCode.Error;
            }
        }

        public async Task<ResultCode> UpdatePersonalProperty(BaseGameRequest<PersonalPropertyRequest> request, MaBGameSettings maBGameSettings)
        {
            return await _adminGameRepository.UpdatePersonalProperty(request, maBGameSettings);
        }
    }
}
