using System.ComponentModel.DataAnnotations;
using static System.Net.Mime.MediaTypeNames;

namespace DragonVStudio.API.Domain.GameEntities
{
    public class Faction
    {
        [Key]
        public int Id { get; set; } 
        public int FactionIndex { get; set; } 

        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string BannerKey { get; set; }

        [MaxLength(255)]
        public string LordId { get; set; } 
        public string Marshalls { get; set; } 

    }
}
