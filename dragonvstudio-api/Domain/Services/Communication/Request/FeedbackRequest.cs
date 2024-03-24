using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class FeedbackRequest
    {
        [Required]
        public double Rating { get; set; }
        [Required]
        public string YourFeedback {get;set;}
    }
}
