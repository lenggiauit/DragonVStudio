using static System.Net.Mime.MediaTypeNames;
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.GameEntities
{
    public class Log
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }

        [MaxLength(255)]
        public string IssuerPlayerId { get; set; }

        [MaxLength(255)]
        public string IssuerPlayerName { get; set; }

        [MaxLength(255)]
        public string ActionType { get; set; }

        [MaxLength(255)]
        public string IssuerCoordinates { get; set; } 
        public string LogMessage { get; set; } 
        public string AffectedPlayers { get; set; } 

    }
}
