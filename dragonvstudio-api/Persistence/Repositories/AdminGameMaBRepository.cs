using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
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

        public async Task<ResultCode> AssignTeamsToBattleEvent(BaseGameRequest<EventPlayersRequest> request, MaBGameSettings maBGameSettings)
        {
            try
            {
                var oldList = await _dragonVContext.BattleEventPlayer.ToListAsync();
                _dragonVContext.BattleEventPlayer.RemoveRange(oldList);

                List<BattleEventPlayer> newList = new List<BattleEventPlayer>();

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
                    });
                }

                await _dragonVContext.BattleEventPlayer.AddRangeAsync(newList);
                await _dragonVContext.SaveChangesAsync();

                // set game database

                var listPLayers = await _context.Players.Where(p => newList.Select(l => l.PlayerId).Contains(p.PlayerId)).ToListAsync(); 

                foreach (var player in listPLayers) 
                {
                    var newInfo = newList.Where(p => p.PlayerId.Equals(player.PlayerId)).FirstOrDefault();
                    if(newInfo != null)
                    {
                        player.Class = newInfo.Class;
                        player.FactionIndex = newInfo.Team == 1 ? maBGameSettings.BattleTeam1_FactionIndex : maBGameSettings.BattleTeam2_FactionIndex;
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

        public async Task<(List<Player>, int, ResultCode)> GetPlayersList(BaseGameRequest<PlayerFilterRequest> request)
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
                        Faction = _context.Factions.Where(f => f.FactionIndex.Equals(p.FactionIndex)).FirstOrDefault()
                    })
                     .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), query.Count() , ResultCode.Success);

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
                    .Where(l => l.CreatedAt.Date > request.Payload.CreatedAt 
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

        public async Task<ResultCode> SavePlayersEvent(BaseGameRequest<EventPlayersRequest> request,  MaBGameSettings maBGameSettings)
        {
            try
            {
                var oldList = await _dragonVContext.BattleEventPlayer.ToListAsync();
                _dragonVContext.BattleEventPlayer.RemoveRange(oldList);

                List<BattleEventPlayer> newList = new List<BattleEventPlayer>();

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
    }
}
