using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class AddUpdateFileSharingRequest
    { 
        public Guid Id { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public string Name { get; set; } 
        [Required]
        public string Url { get; set; }
        public bool IsArchived { get; set; }
    }
}
