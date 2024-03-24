using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class RequestId
    {
        [Required]
        public Guid Id { get; set; }
    }
}
