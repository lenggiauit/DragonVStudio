using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Resources.Game
{
    public class FactionResource
    {
        public int Id { get; set; }
        public int FactionIndex { get; set; } 
        public string Name { get; set; } 
        public string BannerKey { get; set; } 
        public string LordId { get; set; }
        public string Marshalls { get; set; }
    }
}
