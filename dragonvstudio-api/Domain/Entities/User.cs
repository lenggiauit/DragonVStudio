using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace DragonVStudio.API.Domain.Entities
{
    public class User : BaseEntity
    { 
        public string UserName { get; set; }
        public string DiscordId { get; set; }
        public string DiscordName { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; } 
        public string Avatar { get; set; }
        public string Email { get; set; }
        public Guid RoleId { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; } 
        public string Address { get; set; } 
        public decimal Cash {  get; set; }   
        public virtual Role Role { get; set; } 
        [NotMapped]
        public virtual List<Permission> Permissions { get; set; }
        
        [NotMapped]
        public List<string> DiscordRoles { get; set; }


    }
}
