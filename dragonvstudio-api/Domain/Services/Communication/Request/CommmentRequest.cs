using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class CommmentRequest
    {
        [Required]
        public Guid PostId { get; set; }
    }
}
