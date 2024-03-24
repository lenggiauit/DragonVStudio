using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class GetPropertysByIdRequest
    {
        [Required]
        public Guid Id { get; set; }
    }
}
