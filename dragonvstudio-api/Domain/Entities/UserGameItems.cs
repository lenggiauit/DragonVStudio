using System;

namespace DragonVStudio.API.Domain.Entities
{
    public class UserGameItems : BaseEntity
    {
        public Guid GameItemId { get; set; }
        public DateTime ReceivedDate { get; set; }  
        public DateTime ExpiredDate { get; set;}
        public bool IsActive {  get; set; } 
    }
}
