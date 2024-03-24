using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class CreateEditPropertyRequest
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string[] Images { get; set; }
        [Required]
        public Guid PropertyTypeId { get; set; }
        [Required]
        public string Description { get; set; }
        public bool IsArchived { get; set; }
    }
}
