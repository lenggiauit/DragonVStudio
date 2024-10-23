using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class AddEditGachaItemRequest
    { 
        public Guid Id { get; set; }
        [Required]
        [MaxLength(250)]
        public string Name { get; set; }
        [Required]
        [MaxLength(250)]
        public string Code { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
