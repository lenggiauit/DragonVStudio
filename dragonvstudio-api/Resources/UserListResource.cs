using System;

namespace DragonVStudio.API.Resources
{
    public class UserListResource
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string DiscordId { get; set; }
        public bool IsActive { get; set; }
        public string Avatar { get; set; }
        public string Email { get; set; } 
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
