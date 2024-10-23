using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories; 
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Request.Player; 
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;  
using System.Linq;
using System.Linq.Dynamic.Core; 
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class GameMaBRepository : IGameMaBRepository
    {
        protected readonly MountAndBladeContext _context;
        protected readonly DragonVContext _dragonVContext;
        private readonly ILogger<GameMaBRepository> _logger;
        public GameMaBRepository(DragonVContext dragonVContext, MountAndBladeContext context, ILogger<GameMaBRepository> logger)
        {
            _dragonVContext = dragonVContext;
            _context = context;
            _logger = logger;
        }

        public async Task<(List<GameItem>, int, ResultCode)> GetGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings)
        {
            try
            {
                var query = _dragonVContext.GameItems.AsNoTracking()
                    .Where(u => u.GameUrl.Equals(request.GameUrl) && u.IsActive && u.IsInGameCash && u.Stock > 0 )
                    .AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Name.Contains(request.Payload.Keywords));
                }

               var result = query.AsEnumerable().Where(u => u.DiscordRole.Split(",").Any(x => discordRoles.Any(y => x.Equals(y)))).ToList();

                return (result
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
                        Stock = p.Stock,
                        Duration = p.Duration,
                        IsInGameCash = p.IsInGameCash,
                        DiscordRole = p.DiscordRole,

                    })
                    .ToList(), query.Count(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetGameItems method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(List<UserGameItems>, int, ResultCode)> GetPlayerGameItems(Guid userId, BaseGameRequest<GameItemFilterRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                
                var query = _dragonVContext.UserGameItems.AsNoTracking()
                                           .Join(_dragonVContext.GameItems, p => p.GameItemId,
                   g => g.Id,
                   (p, g) => new { p, g })

                  .Where(u => u.p.GameUrl.Equals(request.GameUrl) && u.p.IsActive && DateTime.Now < u.p.ExpiredDate).AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.g.Name.Contains(request.Payload.Keywords));
                }


                return (await _dragonVContext.UserGameItems.AsNoTracking()
                                           .Join(_dragonVContext.GameItems, p => p.GameItemId,
                   g => g.Id,
                   (p, g) => new { p, g })

                  .Where(u => u.p.GameUrl.Equals(request.GameUrl) && u.p.IsActive && DateTime.Now <  u.p.ExpiredDate )
                   .Select(h => new UserGameItems()
                   {
                       Id = h.p.Id,
                       UserId = h.p.UserId,
                       PlayerId = h.p.PlayerId,
                       GameItemId = h.p.GameItemId,
                       ItemInfo = h.g,
                       ReceivedDate = h.p.ReceivedDate,
                       ExpiredDate = h.p.ExpiredDate,
                       IsTaken = h.p.IsTaken,
                       LastTakenTime = h.p.LastTakenTime,

                   })

                   .ToListAsync(), query.Count(), ResultCode.Success); 

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayerGameItems method: " + ex.Message);
                return (null, 0, ResultCode.Error);
            }
        }

        public async Task<(Player, ResultCode)> GetPlayerInfo(BaseGameRequest<PlayerInfoRequest> request)
        {
            try
            {
                var userInGame = await _dragonVContext.UserInGame.AsNoTracking().Where(u => u.GameUrl.Equals(request.GameUrl) && u.UserId.Equals(request.Payload.UserId)).FirstOrDefaultAsync();

                if (userInGame == null)
                {
                    var user = await _dragonVContext.User.Where(u => u.Id.Equals(request.Payload.UserId)).FirstOrDefaultAsync();
                    if(user != null && !string.IsNullOrEmpty( user.DiscordId))
                    {
                        var player = await _context.Players.Where(p => p.DiscordId.Equals(user.DiscordId)).FirstOrDefaultAsync();
                        if (player != null)
                        {
                            var newUserInGame = new UserInGame()
                            {
                                Id = Guid.NewGuid(),
                                GameUrl = request.GameUrl,
                                PlayerId = player.PlayerId,
                                UserId = request.Payload.UserId,
                                CreatedBy = request.Payload.UserId,
                                CreatedDate = DateTime.UtcNow,
                            };

                            await  _dragonVContext.UserInGame.AddAsync(newUserInGame);
                            await _dragonVContext.SaveChangesAsync(); 
                            return (player, ResultCode.Success);
                        }
                        else
                        {
                            return (null, ResultCode.Invalid);
                        }
                    }
                    else
                    {
                        return (null, ResultCode.Invalid);
                    } 
                } 
                else
                {
                    var player = await _context.Players.Where(p => p.PlayerId.Equals(userInGame.PlayerId)).FirstOrDefaultAsync();
                    if (player != null) 
                    { 
                        return (player, ResultCode.Success); 
                    }
                    else
                    {
                        return (null, ResultCode.Invalid);
                    } 
                }
                
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetPlayerInfo method: " + ex.Message);
                return (null,  ResultCode.Error);
            }
        }

        public async Task<ResultCode> PlayerBuyGameItem(Guid userId, BaseGameRequest<PlayerBuyGameItemRequest> request, List<string> discordRoles, MaBGameSettings maBGameSettings)
        {
            try
            {
                var gameItem = await _dragonVContext.GameItems.AsNoTracking().Where(u => u.GameUrl.Equals(request.GameUrl) && u.IsActive && u.Id.Equals(request.Payload.ItemId)).FirstOrDefaultAsync();
                var userInGame = await _dragonVContext.UserInGame.AsNoTracking().Where(u => u.GameUrl.Equals(request.GameUrl) && u.UserId.Equals( userId )).FirstOrDefaultAsync();

                var userGameItems = await _dragonVContext
                    .UserGameItems
                    .AsNoTracking()
                    .Where(u => u.GameUrl.Equals(request.GameUrl) && u.UserId.Equals(userId) && u.ExpiredDate > DateTime.Now && u.GameItemId.Equals(request.Payload.ItemId)).FirstOrDefaultAsync();

                if (userGameItems == null)
                {
                    if (userInGame != null && gameItem != null && gameItem.DiscordRole.Split(",").Any(x => discordRoles.Any(y => x.Equals(y))) )
                    {
                        var player = await _context.Players.Where(p => p.PlayerId.Equals(userInGame.PlayerId)).FirstOrDefaultAsync();

                        if (player != null && player.BankAmount >= gameItem.Price)
                        {
                            player.BankAmount = player.BankAmount - gameItem.Price;
                            _context.Players.Update(player);
                            await _context.SaveChangesAsync();

                            var userItem = new UserGameItems()
                            {
                                Id = Guid.NewGuid(),
                                GameUrl = request.GameUrl,
                                CreatedDate = DateTime.Now,
                                IsActive = true,
                                PlayerId = player.PlayerId,
                                UserId = userId,
                                GameItemId = gameItem.Id,
                                CreatedBy = userId,
                                IsTaken = false,
                                ReceivedDate = DateTime.Now,
                                ExpiredDate = DateTime.Now.AddDays(gameItem.Duration),

                            };

                            await _dragonVContext.UserGameItems.AddAsync(userItem);
                            gameItem.Stock = gameItem.Stock - 1;
                            _dragonVContext.GameItems.Update(gameItem);
                            await _dragonVContext.SaveChangesAsync();
                            return (ResultCode.Success);
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
                    return (ResultCode.ExistingItem);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at PlayerBuyGameItem method: " + ex.Message);
                return (  ResultCode.Error);
            }
        }

        public async Task<ResultCode> PlayerDeleteItem(Guid userId, BaseGameRequest<PlayerDeleteItemRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var userGameItem = await _dragonVContext.UserGameItems.AsNoTracking().Where(u => u.GameUrl.Equals(request.GameUrl) && u.Id.Equals(request.Payload.UserItemId)).FirstOrDefaultAsync();
             

                if (userGameItem != null  )
                {
                    userGameItem.IsActive = false;
                    _dragonVContext.UserGameItems.Update(userGameItem);
                    await _dragonVContext.SaveChangesAsync();
                    return (ResultCode.Success); 

                }
                else
                {
                    return (ResultCode.Invalid);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at PlayerDeleteItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> PlayerEquipItem(Guid userId, BaseGameRequest<PlayerEquipItemRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var userItem = await _dragonVContext.UserGameItems.Where(i => i.Id.Equals(request.Payload.UserItemId)).FirstOrDefaultAsync();
                if (userItem != null && (  (userItem.LastTakenTime == null || userItem.LastTakenTime?.Date != DateTime.Now.Date)  ))
                {
                    var item = await _dragonVContext.GameItems.Where(i => i.Id.Equals(userItem.GameItemId)).FirstOrDefaultAsync();

                    if (item != null)
                    {
                        var player = await _context.Players.Where(p => p.PlayerId.Equals(userItem.PlayerId)).FirstOrDefaultAsync();
                        if (player != null)
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

                            userItem.UpdatedDate = DateTime.Now;
                            userItem.IsTaken = true;
                            userItem.LastTakenTime = DateTime.Now;
                            _dragonVContext.UserGameItems.Update(userItem);
                            await _dragonVContext.SaveChangesAsync();
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
                _logger.LogError("Error at PlayerEquipItem method: " + ex.Message);
                return (ResultCode.Error);
            }
        }
    }
}
