using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Player
{
    public class PlayerDeleteItemRequest
    {
        [Required]
        public Guid UserItemId { get; set; }
    }
}
