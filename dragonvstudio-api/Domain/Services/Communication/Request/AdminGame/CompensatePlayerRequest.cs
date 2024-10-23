using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class CompensatePlayerRequest
    {
        [Required]
        public string PlayerId { get; set; }
        [Required]
        public int Gold { get; set; }
    }
}
