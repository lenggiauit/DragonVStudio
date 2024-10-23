namespace DragonVStudio.API.Resources.Game
{
    public class PlayerEventResource
    { 
        public string PlayerId { get; set; }
        public string DiscordId { get; set; }
        public string Name { get; set; } 
        public string Class { get; set; }
        public int Team { get; set; }
        public string PreviousClass { get; set; }
        public int PreviousFactionIndex { get; set; } 
    }
}
