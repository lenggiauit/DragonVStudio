using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonVStudio.API.Domain.Entities
{
    public class UserGameItems : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        public Guid UserId { get; set; }
        [MaxLength(250)]
        public string PlayerId { get; set; }
        public Guid GameItemId { get; set; }
        public DateTime ReceivedDate { get; set; }  
        public DateTime? ExpiredDate { get; set;} 
        public bool IsTaken { get; set; }
        public DateTime? LastTakenTime { get; set; }
        public bool IsActive {  get; set; }
        [NotMapped]
        public GameItem ItemInfo { get; set; }
    }
}
