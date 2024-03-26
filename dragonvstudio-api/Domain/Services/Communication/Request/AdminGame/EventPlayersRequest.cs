using DragonVStudio.API.Domain.Entities;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class EventPlayersRequest
    { 
        public EventPlayerModel[] Players { get; set; }    
    } 

    public class EventPlayerModel  
    { 
        public string PlayerId { get; set; }
        public string DiscordId { get; set; }
        public string Name { get; set; }
        public string Class { get; set; }
        public int Team { get; set; }
    }
    

}
