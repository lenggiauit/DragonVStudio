
using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class BannedPlayer : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        [MaxLength(250)]
        public string PlayerId { get; set; }
        [MaxLength(250)]
        public string DiscordId { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Reason { get; set; }  
        public DateTime PunishmentTime { get; set; }
        public bool IsActive { get; set; }  

    }
}
