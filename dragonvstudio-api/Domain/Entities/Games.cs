using DragonVStudio.API.Domain.Helpers;
using Microsoft.VisualBasic;
using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class Games : BaseEntity
    {
        [MaxLength(250)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public int Season { get; set; }

        [MaxLength(50)]
        public string Version { get; set; }
         
        public string Pictures { get; set; } 

        [MaxLength(250)]
        public string BGPicture { get; set; }

        [MaxLength(650)]
        public string BGVideo { get; set; }

        [MaxLength(250)]
        public string Icon { get; set; }

        public DateTime OpenDate { get; set; }

        public DateTime CloseDate { get; set; }

        [MaxLength(250)]
        public string Url { get; set; }

        [MaxLength(250)]
        public string DiscordUrl { get; set; }

        public GameServerStatus ServerStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
