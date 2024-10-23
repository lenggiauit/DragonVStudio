using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class PersonalPropertyRequest
    {
        [Required]
        public int Id { get; set; } 
        public string PropertyName { get; set; }
        public string PropertyBanner { get; set; }
        public string OwnerId { get; set; }
    }
}
