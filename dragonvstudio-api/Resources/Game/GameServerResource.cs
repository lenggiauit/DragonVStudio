using DragonVStudio.API.Domain.Helpers;
using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Resources.Game
{
    public class GameServerResource
    {
        public Guid Id { get; set; }
        public string GameUrl { get; set; }
        public string Name { get; set; } 
        public string Description { get; set; } 
        public int Season { get; set; } 
        public string Version { get; set; } 
        public string Pictures { get; set; } 
        public string BGPicture { get; set; }  
        public string BGVideo { get; set; } 
        public string Icon { get; set; } 
        public DateTime OpenDate { get; set; } 
        public DateTime CloseDate { get; set; }   
        public string DiscordUrl { get; set; } 
        public GameServerStatus ServerStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
