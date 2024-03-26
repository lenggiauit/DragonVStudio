using DragonVStudio.API.Domain.Helpers;
using Microsoft.VisualBasic;
using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DragonVStudio.API.Domain.Entities
{
    public class GameServer : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }

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

        [AllowNull]
        public DateTime OpenDate { get; set; }

        [AllowNull]
        public DateTime CloseDate { get; set; } 

        [MaxLength(250)]
        public string DiscordUrl { get; set; }

        public string ServerStatus { get; set; }
        public bool IsActive { get; set; }
    }
}
