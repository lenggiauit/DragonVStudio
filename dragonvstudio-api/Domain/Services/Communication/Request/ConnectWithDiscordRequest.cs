using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class ConnectWithDiscordRequest
    {
        public Guid UserId { get; set; }
        public string DiscordId { get; set; }
        public string DiscordName { get; set; }
    }
}
