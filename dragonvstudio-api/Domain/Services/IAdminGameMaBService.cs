using DragonVStudio.API.Domain.Entities;
using System.Threading.Tasks;
using System;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System.Collections.Generic;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Request.Player;

namespace DragonVStudio.API.Domain.Services
{
    public interface IAdminGameMaBService
    {
        Task<ResultCode> AddEditGachaItem(Guid userId, BaseGameRequest<AddEditGachaItemRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> AddEditGameItem(Guid userId, BaseGameRequest<AddEditGameItemRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> AssignItemToPlayer(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> AssignPlayerBackToPreviousRoleAndfaction(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> AssignPlayerToPrison(BaseGameRequest<PlayerActionRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> BanPlayer(Guid userId, BaseGameRequest<BanPlayerRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> ChangePlayerName(Guid userId, BaseGameRequest<ChangePlayerNameRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> DeleteGachaItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> DeleteGameItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> DeletePLayerGameItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<BannedPlayer>, int, ResultCode)> GetBannedPlayers(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<GachaItem>, int, ResultCode)> GetGachaItems(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<GachaItem>, int, ResultCode)> GetGachaItemsForEvent(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings);
       
        Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request);
        Task<(List<Player>, int, ResultCode)> GetPlayersHasItem(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<Player>, int , ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request);
        Task<(List<Log>, int, ResultCode)> GetPlayersLogs(BaseGameRequest<PlayerLogRequest> request);
        Task<(List<BattleEventPlayer> , ResultCode)> GetSavedPlayersEvent(BaseGameRequest<PlayerFilterRequest> request);
        Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> UnbanPlayer(Guid userId, BaseGameRequest<UnbanPlayerRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> TakePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> GivePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings);
        Task<(List<PersonalProperties>, int , ResultCode)> GetPersonalProperty(MaBGameSettings maBGameSettings);
        Task<ResultCode> UpdatePersonalProperty(BaseGameRequest<PersonalPropertyRequest> request, MaBGameSettings maBGameSettings);
    }
}
