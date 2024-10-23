using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Resources.Game
{
    public class GameItemResource
    { 
        public Guid Id { get; set; } 
        public string Name { get; set; } 
        public string Code { get; set; } 
        public string Class { get; set; } 
        public string Type { get; set; } 
        public string Description { get; set; }
        public string Images { get; set; }
        public int Stock { get; set; }
        public int Price { get; set; }
        public int Duration { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsInGameCash { get; set; }
        public bool IsActive { get; set; } 
        public string DiscordRole {  get; set; }    
    }
}
