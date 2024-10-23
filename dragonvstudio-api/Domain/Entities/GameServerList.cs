using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class GameServerList : BaseEntity
    { 
        public Guid GameServerId { get; set; }

        [MaxLength(250)]
        public string GameUrl { get; set; }

        [MaxLength(50)]
        public string GameServerName { get; set; }

        [MaxLength(50)]
        public string GameRegion { get; set; }

        [MaxLength(50)]
        public string GameIpAddress { get; set; }
         
        [MaxLength(50)]
        public string ServerStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
