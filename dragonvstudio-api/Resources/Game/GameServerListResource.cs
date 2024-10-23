using System.ComponentModel.DataAnnotations;
using System;

namespace DragonVStudio.API.Resources.Game
{
    public class GameServerListResource
    {
        public Guid Id { get; set; }
        public Guid GameServerId { get; set; } 
        public string GameUrl { get; set; } 
        public string GameServerName { get; set; } 
        public string GameRegion { get; set; } 
        public string GameIpAddress { get; set; } 
        public string ServerStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
