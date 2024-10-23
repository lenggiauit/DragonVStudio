using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class GachaItemFilterRequest
    {
        [MaxLength(50)]
        public string Keywords { get; set; }
    }
}
