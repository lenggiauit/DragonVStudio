using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class ContactRequest
    {
        [Required]
        public string YourName { get; set; }
        [Required]
        public string YourEmail { get; set; }
        [Required]
        public string YourMessage { get; set; }
    }
}
