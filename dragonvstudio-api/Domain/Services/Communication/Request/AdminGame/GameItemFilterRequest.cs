using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class GameItemFilterRequest
    {
        [MaxLength(50)]
        public string Keywords { get; set; }
    }
}
