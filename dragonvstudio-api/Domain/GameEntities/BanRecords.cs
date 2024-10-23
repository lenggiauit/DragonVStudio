using static System.Net.Mime.MediaTypeNames;
using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.GameEntities
{
    public class BanRecords
    { 
        [Key]
        public int Id { get; set; }

        [MaxLength(255)]
        public string PlayerId { get; set; }

        [MaxLength(255)]
        public string PlayerName { get; set; }
         
        public string BanReason { get; set; }
         
        public string UnbanReason { get; set; }

        [MaxLength(255)]
        public string BannedBy { get; set; } 

        public DateTime CreatedAt { get; set; }
        public DateTime BanEndsAt { get; set; }  
    }
}
