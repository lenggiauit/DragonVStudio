namespace DragonVStudio.API.Domain.Entities
{
    public class PlayerEventInfo : BaseEntity
    { 
        public string GameUrl { get; set; }
        public string PlayerId { get; set; }
        public string DiscordId { get; set; }
        public string Name { get; set; }
        public string Class { get; set; }
        public int FactionIndex { get; set; } 
        public string PreviousClass { get; set; }
        public int PreviousFactionIndex { get; set; }
    }
}
