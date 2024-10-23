using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Player
{
    public class PlayerInfoRequest
    {
        [Required]
        public Guid UserId { get; set; }
    }
}
