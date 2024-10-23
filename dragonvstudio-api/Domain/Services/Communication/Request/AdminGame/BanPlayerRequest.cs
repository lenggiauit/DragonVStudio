using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class BanPlayerRequest
    {
       
        public Guid UserId { get; set; } 
        [Required]
        public string PlayerId { get; set; } 
        public string DiscordId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public long PunishmentTime { get; set; } 
    }

    public class UnbanPlayerRequest
    { 
        public Guid UserId { get; set; }
        [Required]
        public string PlayerId { get; set; } 
    }
}
