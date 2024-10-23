using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Player
{
    public class PlayerEquipItemRequest
    {
        [Required]
        public Guid UserItemId { get; set; }
    }
}
