using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class PlayerLogRequest
    {
        [MaxLength(255)]
        public string Keywords { get; set; }
        [MaxLength(255)]
        public string ActionType { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
