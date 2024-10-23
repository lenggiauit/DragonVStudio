using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class PlayerMoneyRequest
    {
        public Guid UserId { get; set; }
        [Required]
        public string PlayerId { get; set; } 
        public string DiscordId { get; set; }
        [Required]
        public int Amount { get; set; } 
    }
}
