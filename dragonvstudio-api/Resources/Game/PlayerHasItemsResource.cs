namespace DragonVStudio.API.Resources.Game
{
    public class PlayerHasItemsResource
    {
        public string PlayerId { get; set; }
        public string DiscordId { get; set; }
        public string Name { get; set; }
        public UserGameItemsResource[] Items { get; set; }  
    }
}
