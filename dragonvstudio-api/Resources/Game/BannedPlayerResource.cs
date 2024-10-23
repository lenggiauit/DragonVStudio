using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Resources.Game
{
    public class BannedPlayerResource
    { 
        public Guid Id { get; set; }    
        public string GameUrl { get; set; } 
        public string PlayerId { get; set; } 
        public string DiscordId { get; set; } 
        public string Name { get; set; } 
        public string Reason { get; set; }
        public DateTime PunishmentTime { get; set; }
        public bool IsActive { get; set; }
    }
}
