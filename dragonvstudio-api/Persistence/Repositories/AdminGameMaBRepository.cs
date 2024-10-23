using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories; 
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Extensions; 
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class AdminGameMaBRepository : IAdminGameMaBRepository
    {
        protected readonly MountAndBladeContext _context;
        protected readonly DragonVContext _dragonVContext;
        private readonly ILogger<AdminGameMaBRepository> _logger;
        public AdminGameMaBRepository(DragonVContext dragonVContext,MountAndBladeContext context, ILogger<AdminGameMaBRepository> logger)  
        {
            _dragonVContext = dragonVContext;
            _context = context; 
            _logger = logger;
        }

        public async Task<ResultCode> AddEditGachaItem(Guid userId, BaseGameRequest<AddEditGachaItemRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {

                if (request.Payload.Id == Guid.Empty)
                {
                    var newItem = new GachaItem()
                    {
                        Id = Guid.NewGuid(),
                        Name = request.Payload.Name, 
                        Code = request.Payload.Code,
                        GameUrl = request.GameUrl,
                        Quantity = request.Payload.Quantity,
                        CreatedBy = userId,
                        CreatedDate = DateTime.UtcNow, 
                        IsActive = request.Payload.IsActive,  
                    };

                    await _dragonVContext.GachaItems.AddAsync(newItem);
                    await _dragonVContext.SaveChangesAsync();
                    return (ResultCode.Success);
                }
                else
                {
                    var currentItem = await _dragonVContext.GachaItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                    if (currentItem != null)
                    {
                        currentItem.UpdatedDate = DateTime.UtcNow;
                        currentItem.Name = request.Payload.Name; 
                        currentItem.Code = request.Payload.Code;
                        currentItem.Quantity = request.Payload.Quantity;
                        currentItem.UpdatedBy = userId; 
                        currentItem.IsActive = request.Payload.IsActive;
                         
                        _dragonVContext.GachaItems.Update(currentItem);
                        await _dragonVContext.SaveChangesAsync();
                        return (ResultCode.Success);
                    }
                    else
                    {
                        return (ResultCode.Invalid);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AddEditGachaItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> AddEditGameItem(Guid userId, BaseGameRequest<AddEditGameItemRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {

                if(request.Payload.Id == Guid.Empty)
                {
                    var newItem = new GameItem()
                    {
                        Id = Guid.NewGuid(),
                        Name = request.Payload.Name,
                        GameUrl = request.GameUrl,
                        Class = request.Payload.Class,
                        Code = request.Payload.Code,
                        CreatedBy = userId,
                        CreatedDate = DateTime.UtcNow,
                        Description = request.Payload.Description,
                        Images = request.Payload.Images,
                        IsActive = request.Payload.IsActive,
                        IsFavorite = request.Payload.IsFavorite,
                        Price = request.Payload.Price,
                        Stock = request.Payload.Stock,
                        Duration = request.Payload.Duration,
                        Type = request.Payload.Type,
                        IsInGameCash = request.Payload.IsInGameCash,
                        DiscordRole = request.Payload.DiscordRole,  

                    };

                    await _dragonVContext.GameItems.AddAsync(newItem);
                    await _dragonVContext.SaveChangesAsync();
                    return (ResultCode.Success);
                }
                else
                {
                    var currentItem = await _dragonVContext.GameItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                    if(currentItem != null)
                    {
                        currentItem.UpdatedDate = DateTime.UtcNow;
                        currentItem.Name = request.Payload.Name;
                        currentItem.Stock = request.Payload.Stock;
                        currentItem.Code = request.Payload.Code;
                        currentItem.Description = request.Payload.Description;
                        currentItem.Class = request.Payload.Class;
                        currentItem.Images = request.Payload.Images;
                        currentItem.CreatedBy = userId;
                        currentItem.Duration = request.Payload.Duration;    
                        currentItem.Price = request.Payload.Price;
                        currentItem.IsActive = request.Payload.IsActive;
                        currentItem.IsFavorite = request.Payload.IsFavorite;
                        currentItem.Type = request.Payload.Type;
                        currentItem.IsInGameCash = request.Payload.IsInGameCash;  
                        currentItem.DiscordRole = request.Payload.DiscordRole;  
                        _dragonVContext.GameItems.Update(currentItem);
                        await _dragonVContext.SaveChangesAsync(); 
                        return (ResultCode.Success);
                    }
                    else
                    {
                        return (ResultCode.Invalid);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AddEditGameItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> AssignItemToPlayer(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var userItem = await _dragonVContext.UserGameItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                if (userItem != null)
                {
                    var item = await _dragonVContext.GameItems.Where(i => i.Id.Equals(userItem.GameItemId)).FirstOrDefaultAsync();

                    if(item != null)
                    {
                        var player = await _context.Players.Where(p => p.PlayerId.Equals(userItem.PlayerId)).FirstOrDefaultAsync();
                        if(player != null)
                        {
                            switch (item.Type.ToLower())
                            {
                                case "horse":
                                    player.Horse = item.Code;
                                    break;
                                case "equipment_0":
                                    player.Equipment_0 = item.Code;
                                    break;
                                case "equipment_1":
                                    player.Equipment_1 = item.Code;
                                    break;
                                case "equipment_2":
                                    player.Equipment_2 = item.Code;
                                    break;
                                case "equipment_3":
                                    player.Equipment_3 = item.Code;
                                    break;
                                case "armor_head":
                                    player.Armor_Head = item.Code;
                                    break;
                                case "armor_body":
                                    player.Armor_Body = item.Code;
                                    break;
                                case "armor_leg":
                                    player.Armor_Leg = item.Code;
                                    break;
                                case "armor_gloves":
                                    player.Armor_Gloves = item.Code;
                                    break;
                                case "armor_cape":
                                    player.Armor_Cape = item.Code;
                                    break;
                            }

                            _context.Players.Update(player);
                            await _context.SaveChangesAsync();
                            return ResultCode.Success;
                        }
                        else
                        {
                            return (ResultCode.Invalid);
                        }
                    }
                    else
                    {
                        return (ResultCode.Invalid);
                    }
                    
                }
                else
                {
                    return (ResultCode.Invalid);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AssignItemToPlayer method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> AssignPlayerBackToPreviousRoleAndfaction(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var currentList = await _dragonVContext.BattleEventPlayer.AsNoTracking().ToListAsync();
                 
                List<BattleEventPlayer> newList = new List<BattleEventPlayer>();

                // Get player info
                var listPLayers = await _context.Players.Where(p => currentList.Select(l => l.PlayerId).Contains(p.PlayerId)).ToListAsync();
  
                foreach (var player in listPLayers)
                {
                    var newInfo = currentList.Where(p => p.PlayerId.Equals(player.PlayerId)).FirstOrDefault();
                    if (newInfo != null)
                    {
                        player.Class = newInfo.PreviousClass;
                        player.FactionIndex = newInfo.PreviousFactionIndex; 
                        player.Horse =  newInfo.PreviousHorse;  
                        player.Armor_Cape = newInfo.PreviousArmor_Cape;
                        player.Armor_Leg = newInfo.PreviousArmor_Leg;
                        player.Armor_Body = newInfo.PreviousArmor_Body; 
                        player.Armor_Head = newInfo.PreviousArmor_Head;
                        player.Armor_Gloves =   newInfo.PreviousArmor_Gloves;
                        player.Equipment_0 = newInfo.PreviousEquipment_0;
                        player.Equipment_1 = newInfo.PreviousEquipment_1;
                        player.Equipment_2 = newInfo.PreviousEquipment_2;   
                        player.Equipment_3 = newInfo.PreviousEquipment_3;   
                        
                    } 
                }
                _context.Players.UpdateRange(listPLayers);
                await _context.SaveChangesAsync();


                return (ResultCode.Success);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AssignPlayerBackToPreviousRoleAndfaction method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> AssignPlayerToPrison(BaseGameRequest<PlayerActionRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var player = await _context.Players.Where(p => p.PlayerId.Equals(request.Payload.PlayerId)).FirstOrDefaultAsync();
                if(player != null)
                {
                    player.FactionIndex = maBGameSettings.Prison_FactionIndex;
                    player.Class = maBGameSettings.Prison_Class;
                    player.PosX = maBGameSettings.Prison_Position[0];
                    player.PosY = maBGameSettings.Prison_Position[1];
                    player.PosZ = maBGameSettings.Prison_Position[2];

                    _context.Players.Update(player);
                    await _context.SaveChangesAsync();
                    return ResultCode.Success;
                }
                else
                {
                    return (ResultCode.Invalid);
                } 
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AssignPlayerToPrison method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var oldList = await _dragonVContext.BattleEventPlayer.ToListAsync();
                _dragonVContext.BattleEventPlayer.RemoveRange(oldList);

                List<BattleEventPlayer> newList = new List<BattleEventPlayer>();

                // Get player info
                var listPLayers = await _context.Players.Where(p => request.Payload.Players.Select(l => l.PlayerId).Contains(p.PlayerId)).ToListAsync();

                foreach (var player in request.Payload.Players)
                {
                    newList.Add(new BattleEventPlayer()
                    {
                        Id = Guid.NewGuid(),
                        Name = player.Name,
                        Class = player.Class,
                        DiscordId = player.DiscordId,
                        Team = player.Team,
                        GameUrl = request.GameUrl,
                        PlayerId = player.PlayerId,
                        CreatedDate = DateTime.Now,
                        PreviousClass = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Class).FirstOrDefault(),
                        PreviousFactionIndex = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.FactionIndex).FirstOrDefault(),
                        PreviousArmor_Body = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Armor_Body).FirstOrDefault(),
                        PreviousArmor_Cape = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Armor_Cape).FirstOrDefault(),
                        PreviousArmor_Gloves = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Armor_Gloves).FirstOrDefault(),
                        PreviousArmor_Head = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Armor_Head).FirstOrDefault(),
                        PreviousArmor_Leg = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Armor_Leg).FirstOrDefault(),
                        PreviousEquipment_0 = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Equipment_0).FirstOrDefault(),
                        PreviousEquipment_1 = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Equipment_1).FirstOrDefault(),
                        PreviousEquipment_2 = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Equipment_2).FirstOrDefault(),
                        PreviousEquipment_3 = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Equipment_3).FirstOrDefault(),
                        PreviousHorse = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Horse).FirstOrDefault(),
                    });
                }

                await _dragonVContext.BattleEventPlayer.AddRangeAsync(newList);
                await _dragonVContext.SaveChangesAsync();

                // set game database

                var equimentList = maBGameSettings.EventEquipments.Where(e => e.Id.Equals(request.Payload.EquipmentId)).ToList();
                 

                foreach (var player in listPLayers) 
                {
                    var newInfo = newList.Where(p => p.PlayerId.Equals(player.PlayerId)).FirstOrDefault();
                    if(newInfo != null)
                    {
                        player.Class = newInfo.Class;
                        player.FactionIndex = newInfo.Team == 1 ? maBGameSettings.BattleTeam1_FactionIndex : maBGameSettings.BattleTeam2_FactionIndex;
                        if(equimentList.Count() > 0)
                        {
                            var classEquiment = equimentList.Where(e => e.Class.Equals(player.Class)).FirstOrDefault();
                            if(classEquiment != null)
                            {
                                player.Horse = classEquiment.Horse; 
                                player.Armor_Body = classEquiment.Armor_Body;
                                player.Armor_Leg = classEquiment.Armor_Leg; 
                                player.Armor_Head = classEquiment.Armor_Head;   
                                player.Armor_Gloves = classEquiment.Armor_Gloves;
                                player.Armor_Cape = classEquiment.Armor_Cape;   
                                player.Equipment_0 = classEquiment.Equipment_0; 
                                player.Equipment_1 = classEquiment.Equipment_1;
                                player.Equipment_2 = classEquiment.Equipment_2; 
                                player.Equipment_3 = classEquiment.Equipment_3;
                                player.PosX = newInfo.Team == 1 ? maBGameSettings.BattleTeam1_Position[0] : maBGameSettings.BattleTeam2_Position[0];
                                player.PosY = newInfo.Team == 1 ? maBGameSettings.BattleTeam1_Position[1] : maBGameSettings.BattleTeam2_Position[1];
                                player.PosZ = newInfo.Team == 1 ? maBGameSettings.BattleTeam1_Position[2] : maBGameSettings.BattleTeam2_Position[2];
                            } 
                        }
                    } 

                }
                _context.Players.UpdateRange(listPLayers);
                await _context.SaveChangesAsync();


                return (ResultCode.Success);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AssignTeamsToBattleEvent method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> BanPlayer(Guid userId, BaseGameRequest<BanPlayerRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var banUser = new BanRecords()
                { 
                    CreatedAt = DateTime.Now,
                    BanEndsAt = DateTimeOffset.FromUnixTimeSeconds(DateTimeOffset.UtcNow.ToUnixTimeSeconds() + request.Payload.PunishmentTime * 24 * 60 * 60).UtcDateTime,
                    BannedBy = userId.ToString(),
                    BanReason = request.Payload.Reason,
                    PlayerId = request.Payload.PlayerId,
                    PlayerName = request.Payload.Name                    
                }; 
                await _context.BanRecords.AddAsync(banUser);
                await _context.SaveChangesAsync(); 
                return (ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at BanPlayer method: " + ex.Message);
                return ( ResultCode.Error);
            }
        }

        public async Task<ResultCode> ChangePlayerName(Guid userId, BaseGameRequest<ChangePlayerNameRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var player = await _context.Players.Where(p => p.PlayerId.Equals(request.Payload.PlayerId)).FirstOrDefaultAsync();
                if (player != null)
                {
                    player.Name = request.Payload.Name;
                    player.CustomName = request.Payload.Name;  
                    _context.Players.Update(player);
                    await _context.SaveChangesAsync();
                    return ResultCode.Success;
                }
                else
                {
                    return (ResultCode.Invalid);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at ChangePlayerName method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> DeleteGachaItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {

            try
            {

                if (request.Payload.Id == Guid.Empty)
                {
                    return (ResultCode.Error);
                }
                else
                {
                    var currentItem = await _dragonVContext.GachaItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                    if (currentItem != null)
                    {

                        _dragonVContext.GachaItems.Remove(currentItem);
                        await _dragonVContext.SaveChangesAsync();
                        return (ResultCode.Success);
                    }
                    else
                    {
                        return (ResultCode.Invalid);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at DeleteGachaItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> DeleteGameItem(Guid userId, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {

                if (request.Payload.Id == Guid.Empty)
                { 
                    return (ResultCode.Error);
                }
                else
                {
                    var currentItem = await _dragonVContext.GameItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                    if (currentItem != null)
                    {
                      
                        _dragonVContext.GameItems.Remove(currentItem);
                        await _dragonVContext.SaveChangesAsync();
                        return (ResultCode.Success);
                    }
                    else
                    {
                        return (ResultCode.Invalid);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at DeleteGameItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> DeletePLayerGameItem(Guid userID, BaseGameRequest<GameItemActionRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var userItem = await _dragonVContext.UserGameItems.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                if (userItem != null)
                {
                    userItem.IsActive = false;  
                    userItem.UpdatedDate = DateTime.UtcNow;
                    userItem.UpdatedBy = userID;
                    _dragonVContext.UserGameItems.Update(userItem);
                    await _dragonVContext.SaveChangesAsync();
                    return ResultCode.Success;
                }
                else
                {
                    return (ResultCode.Invalid);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at DeletePLayerGameItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<(List<BannedPlayer>, int, ResultCode)> GetBannedPlayers(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _context.BanRecords.AsNoTracking().AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.PlayerName.Contains(request.Payload.Keywords));
                }

                return (await query.Where(b => b.BanEndsAt >= DateTime.UtcNow)
                    .Select(p => new BannedPlayer()
                    { 
                        PlayerId = p.PlayerId, 
                        Name = p.PlayerName,
                        Reason = p.BanReason,
                        CreatedDate = p.CreatedAt,  
                        PunishmentTime = p.BanEndsAt,
                    })
                     .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetBannedPlayers method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }

        }

        public async Task<(List<GachaItem>, int, ResultCode)> GetGachaItems(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _dragonVContext.GachaItems.AsNoTracking().Where(g => g.GameUrl.Equals(request.GameUrl)) .AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

                return (await query 
                    .Select(p => new GachaItem()
                    {
                        Id = p.Id, 
                        Name = p.Name,
                        Code = p.Code,
                        IsActive = p.IsActive,
                        Quantity = p.Quantity,
                    })
                     .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGachaItems method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<GachaItem>, int, ResultCode)> GetGachaItemsForEvent(BaseGameRequest<GachaItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _dragonVContext.GachaItems.AsNoTracking().Where(g => g.GameUrl.Equals(request.GameUrl) && g.IsActive).AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

                return (await query
                    .Select(p => new GachaItem()
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Code = p.Code,
                        IsActive = p.IsActive,
                        Quantity = p.Quantity,
                    }) 
                    .ToListAsync(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGachaItemsForEvent method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _dragonVContext.GameItems.AsNoTracking().Where(u => u.GameUrl.Equals(request.GameUrl)).AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

                return (await query
                    .Select(p => new GameItem()
                    {
                        Id = p.Id, 
                        Name = p.Name,
                        Class = p.Class,
                        Description = p.Description,    
                        Code = p.Code,
                        Images = p.Images,
                        IsActive = p.IsActive,
                        IsFavorite = p.IsFavorite,
                        Type = p.Type,
                        Price = p.Price,
                        Stock = p.Stock ,
                        Duration = p.Duration , 
                        IsInGameCash = p.IsInGameCash,
                        DiscordRole = p.DiscordRole,    
                        
                    })
                    .ToListAsync(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameItems method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<PersonalProperties>, int, ResultCode)> GetPersonalProperty(MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _context.PersonalProperties.AsNoTracking().AsQueryable();
                 
                return (await query
                    .Select(p => new PersonalProperties()
                    {
                        Id = p.Id,
                        OwnerId = p.OwnerId,
                        PropertyBanner = p.PropertyBanner,
                        PropertyIndex = p.PropertyIndex,
                        PropertyName = p.PropertyName, 
                    })
                    .ToListAsync(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameItems method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<Player>, ResultCode)> GetPlayerListForEvent(BaseGameRequest<PlayerFilterRequest> request)
        {
            try
            {
                var query = _context.Players.AsNoTracking().AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

                return (await query
                    .Select(p => new Player()
                    {
                        Id = p.Id,
                        PlayerId = p.PlayerId,
                        DiscordId = p.DiscordId,
                        Name = p.Name, 
                        Class = p.Class,
                        FactionIndex = p.FactionIndex, 
                    }) 
                    .ToListAsync(),  ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayerListForEvent method: " + ex.Message);
                return (null,   ResultCode.Error);
            }
        }

        public async Task<(List<Player>, int, ResultCode)> GetPlayersHasItem(BaseGameRequest<PlayerFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var userIdList = await _dragonVContext.UserInGame.Where(u => u.GameUrl.Equals(request.GameUrl)).ToListAsync();
                var query = _context.Players.AsNoTracking().AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

                var listPlayer = await query
                    .Select(p => new Player()
                    {
                        Id = p.Id,
                        PlayerId = p.PlayerId,
                        DiscordId = p.DiscordId,
                        Name = p.Name,
                         
                    })
                     .GetPagingQueryable(request.MetaData)
                    .ToListAsync();


                var playeritems = await _dragonVContext.UserGameItems.AsNoTracking()
                                            .Join(_dragonVContext.GameItems,   p => p.GameItemId,
                    g => g.Id,
                    (p, g) => new { p, g })

                    .Where(u => listPlayer.Select(p => p.PlayerId).Contains(u.p.PlayerId) && u.p.IsActive)
                    .Select(h => new UserGameItems() { 
                        Id  = h.p.Id,
                        UserId = h.p.UserId,
                        PlayerId = h.p.PlayerId,
                        GameItemId = h.p.GameItemId,
                        ItemInfo = h.g,
                        ReceivedDate = h.p.ReceivedDate,
                        ExpiredDate = h.p.ExpiredDate,  

                    } )
                    
                    .ToListAsync();

                foreach ( var p in listPlayer)
                {
                    p.Items = playeritems.Where( i => i.PlayerId.Equals( p.PlayerId ) ).ToArray();

                }
                 
                listPlayer =  listPlayer.ToImmutableList().RemoveRange(listPlayer.Where(l => l.Items.Count() == 0).ToList()).ToList();

                return (listPlayer, query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayersHasItem method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }

        }

        public async Task<(List<Player>, int, ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request)
        {
            try
            {
                var userIdList = await _dragonVContext.UserInGame.Where(u => u.GameUrl.Equals(request.GameUrl)).ToListAsync();
                var query = _context.Players.AsNoTracking().AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords)); 
                }

                var listPlayer = await query
                    .Select(p => new Player()
                    {
                        Id = p.Id,
                        PlayerId = p.PlayerId,
                        DiscordId = p.DiscordId,
                        Name = p.Name,
                        Money = p.Money,
                        BankAmount = p.BankAmount,
                        Horse = p.Horse,
                        HorseHarness = p.HorseHarness,
                        Equipment_0 = p.Equipment_0,
                        Equipment_1 = p.Equipment_1,
                        Equipment_2 = p.Equipment_2,
                        Equipment_3 = p.Equipment_3,
                        Armor_Head = p.Armor_Head,
                        Armor_Body = p.Armor_Body,
                        Armor_Leg = p.Armor_Leg,
                        Armor_Gloves = p.Armor_Gloves,
                        Armor_Cape = p.Armor_Cape,
                        Class = p.Class,
                        CustomName = p.CustomName,
                        Faction = _context.Factions.Where(f => f.FactionIndex.Equals(p.FactionIndex)).FirstOrDefault(), 
                    })
                     .GetPagingQueryable(request.MetaData)
                    .ToListAsync();


                foreach (var p in listPlayer)
                {
                    p.UserId = userIdList.Where(u => u.PlayerId.Equals(p.PlayerId)).Select(u => u.UserId).FirstOrDefault();

                } 


                return (listPlayer, query.Count() , ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayersList method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<Log>, int, ResultCode)> GetPlayersLogs(BaseGameRequest<PlayerLogRequest> request)
        {
            try
            { 
                var query = _context.Logs.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.ActionType))
                {
                    query = query
                    .Where(l => l.ActionType.Equals(request.Payload.ActionType));
                }
                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(
                        l => l.IssuerPlayerId.Contains(request.Payload.Keywords)
                        ||
                        l.IssuerPlayerName.Contains(request.Payload.Keywords)
                        ||
                        l.LogMessage.Contains(request.Payload.Keywords)
                        ||
                        l.AffectedPlayers.Contains(request.Payload.Keywords)
                    );
                }


                if ( request.Payload.CreatedAt != DateTime.MinValue)
                {
                    query = query
                    .Where(l => l.CreatedAt > request.Payload.CreatedAt 
                    );
                }

                return (await query

                    .AsNoTracking()
                    .Select(l => new Log()
                    {
                        Id = l.Id,
                        ActionType = l.ActionType,
                        CreatedAt = l.CreatedAt,
                        IssuerCoordinates = l.IssuerCoordinates,
                        IssuerPlayerId  = l.IssuerPlayerId,
                        IssuerPlayerName = l.IssuerPlayerName,
                        AffectedPlayers = l.AffectedPlayers,
                        LogMessage = l.LogMessage  
                    })
                    .OrderByDescending(l => l.Id)
                    .GetPagingQueryable(request.MetaData) 
                    .ToListAsync(), query.Count() , ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayersLogs method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<BattleEventPlayer>, ResultCode)> GetSavedPlayersEvent(BaseGameRequest<PlayerFilterRequest> request)
        {
            try
            {
               
                return (await _dragonVContext.BattleEventPlayer 
                    .AsNoTracking()
                    .Where(b => b.GameUrl.Equals(request.GameUrl))
                    .Select(l => new BattleEventPlayer()
                    {
                        Team = l.Team,
                        Class = l.Class, 
                        DiscordId = l.DiscordId,
                        Name = l.Name,
                        PlayerId = l.PlayerId,  
                    })
                   
                     
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetSavedPlayersEvent method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<ResultCode> GivePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var player = _context.Players.Where(p => p.PlayerId.Equals(request.Payload.PlayerId)).FirstOrDefault();
                if (player != null)
                { 
                    player.BankAmount = player.BankAmount + request.Payload.Amount;
                    _context.Players.Update(player);
                    await _context.SaveChangesAsync();
                    return ResultCode.Success;  
                }
                else
                {
                    return ResultCode.Error;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at TakePlayerMoney method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request,  MaBGameSettings maBGameSettings)
        {
            try
            {
                var oldList = await _dragonVContext.BattleEventPlayer.ToListAsync();
                _dragonVContext.BattleEventPlayer.RemoveRange(oldList);

                List<BattleEventPlayer> newList = new List<BattleEventPlayer>();
                // Get player info
                var listPLayers = await _context.Players.Where(p => request.Payload.Players.Select(l => l.PlayerId).Contains(p.PlayerId)).ToListAsync();

                foreach (var player in request.Payload.Players) {
                    newList.Add(new BattleEventPlayer()
                    {
                        Id = Guid.NewGuid(),
                        Name = player.Name,
                        Class = player.Class,
                        DiscordId = player.DiscordId,
                        Team = player.Team,
                        GameUrl = request.GameUrl,  
                        PlayerId = player.PlayerId,
                        CreatedDate = DateTime.Now,
                        PreviousClass = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.Class).FirstOrDefault(),
                        PreviousFactionIndex = listPLayers.Where(p => p.PlayerId.Equals(player.PlayerId)).Select(p => p.FactionIndex).FirstOrDefault(),
                    }); 
                }

                await _dragonVContext.BattleEventPlayer.AddRangeAsync(newList);
                await _dragonVContext.SaveChangesAsync();

                return (ResultCode.Success);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at SavePlayersEvent method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> TakePlayerMoney(Guid userId, BaseGameRequest<PlayerMoneyRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var player = _context.Players.Where(p => p.PlayerId.Equals(request.Payload.PlayerId)).FirstOrDefault();
                if(player != null)
                {
                    if(player.BankAmount < request.Payload.Amount)
                    {
                        return ResultCode.Error;
                    }
                    else
                    {
                        player.BankAmount = player.BankAmount - request.Payload.Amount;
                        _context.Players.Update(player);
                        await _context.SaveChangesAsync();
                        return ResultCode.Success;
                    } 

                }
                else
                {
                    return ResultCode.Error;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at TakePlayerMoney method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> UnbanPlayer(Guid userId, BaseGameRequest<UnbanPlayerRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var banUsers = await _context.BanRecords.Where(b => b.PlayerId.Equals(request.Payload.PlayerId)).ToListAsync();

                if(banUsers != null)
                { 
                    _context.RemoveRange (banUsers);
                    await _context.SaveChangesAsync();
                    return (ResultCode.Success);
                }
                else
                {
                    return (ResultCode.Error);
                } 
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at UnbanPlayer method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> UpdatePersonalProperty(BaseGameRequest<PersonalPropertyRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
 
                var pp = await _context.PersonalProperties.Where(i => i.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                if (pp != null)
                { 
                    pp.PropertyName = !string.IsNullOrEmpty(request.Payload.PropertyName) ? request.Payload.PropertyName : pp.PropertyName;
                    pp.PropertyBanner = !string.IsNullOrEmpty(request.Payload.PropertyBanner) ? request.Payload.PropertyBanner : pp.PropertyBanner;
                    pp.OwnerId = !string.IsNullOrEmpty(request.Payload.OwnerId) ? request.Payload.OwnerId : pp.OwnerId;  
                    _context.PersonalProperties.Update(pp);
                    await _context.SaveChangesAsync();
                    return (ResultCode.Success);
                }
                else
                {
                    return (ResultCode.Invalid);
                }
                
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at UpdatePersonalProperty method: " + ex.Message);
                return (ResultCode.Error);
            }
        }
    }
}
