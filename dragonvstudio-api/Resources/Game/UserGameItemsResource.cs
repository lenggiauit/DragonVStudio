using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Resources.Game
{
    public class UserGameItemsResource
    {
        public Guid Id { get; set; }    
        public Guid UserId { get; set; } 
        public string PlayerId { get; set; }
        public Guid GameItemId { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime ExpiredDate { get; set; } 
        public double TimeRemaining => DateTime.Now.Subtract(ReceivedDate).TotalDays; 
        public GameItemResource ItemInfo {  get; set; }
        public bool IsTaken { get; set; }
        public DateTime LastTakenTime { get; set; }

        public bool Equipped => LastTakenTime.Date == DateTime.Now.Date;

    }
}
