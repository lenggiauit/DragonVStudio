using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Resources.Game
{
    public class LogResource
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string IssuerPlayerId { get; set; } 
        public string IssuerPlayerName { get; set; } 
        public string ActionType { get; set; } 
        public string IssuerCoordinates { get; set; }
        public string LogMessage { get; set; }
        public string AffectedPlayers { get; set; }
    }
}
