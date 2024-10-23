using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class GameItemActionRequest
    {
        [Required]
        public Guid Id { get; set; }
    }
}
