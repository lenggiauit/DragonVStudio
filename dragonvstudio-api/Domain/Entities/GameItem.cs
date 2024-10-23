using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class GameItem : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }

        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Code { get; set; }
        [MaxLength(100)]
        public string Class { get; set; }
        [MaxLength(50)]
        public string Type { get; set; }
        [MaxLength(550)]
        public string Description { get; set; } 
        public string Images {  get; set; }  
        public int Stock {  get; set; }
        public int Price { get; set; }
        public int Duration { get; set; }   
        public bool IsFavorite { get; set; }
        public bool IsInGameCash { get; set; }
        public bool IsActive { get; set; } 
        public string DiscordRole {  get; set; }    

    }
}
