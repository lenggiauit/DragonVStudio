using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class CreateEditCategoryRequest
    {
        public Guid? Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; } 
        [Required]
        public string Color { get; set; }
        public bool IsArchived { get; set; }
    }
}
