using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class GameItems : BaseEntity
    {
        public Guid GameId { get; set; }

        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Code { get; set; }
        [MaxLength(100)]
        public string Class { get; set; }
        [MaxLength(50)]
        public string Path { get; set; }
        [MaxLength(550)]
        public string Description { get; set; } 
        public string Images {  get; set; }  
        public int Stock {  get; set; }
        public int Price { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsActive { get; set; }

    }
}
