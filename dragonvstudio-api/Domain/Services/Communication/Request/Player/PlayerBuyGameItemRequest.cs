using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Player
{
    public class PlayerBuyGameItemRequest
    {
        [Required]
        public Guid ItemId { get; set; }
    }
}
