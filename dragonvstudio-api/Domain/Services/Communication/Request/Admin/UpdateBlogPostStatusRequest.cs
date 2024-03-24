using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class UpdateBlogPostStatusRequest
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
