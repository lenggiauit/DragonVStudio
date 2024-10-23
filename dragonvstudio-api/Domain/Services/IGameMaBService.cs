using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Request.Player;
using DragonVStudio.API.Resources.Game;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IGameMaBService
    {
        Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings);
        Task<(List<UserGameItems>, int, ResultCode)> GetPlayerGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings);
        Task<(Player, ResultCode)> GetPlayerInfo(BaseGameRequest<PlayerInfoRequest> request);
        Task<ResultCode> PlayerBuyGameItem(Guid userId, BaseGameRequest<PlayerBuyGameItemRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings);
        Task<ResultCode> PlayerDeleteItem(Guid userId, BaseGameRequest<PlayerDeleteItemRequest> request, MaBGameSettings maBGameSettings);
        Task<ResultCode> PlayerEquipItem(Guid userId, BaseGameRequest<PlayerEquipItemRequest> request, MaBGameSettings maBGameSettings);
    }
}
