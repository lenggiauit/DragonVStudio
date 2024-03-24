using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class AddEventAvailableDateRequest
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public DateTime Start { get; set; }
        [Required]
        public DateTime End { get; set; }
    }
    public class RemoveEventAvailableDateRequest
    {
        [Required]
        public Guid Id { get; set; } 
    }


}
