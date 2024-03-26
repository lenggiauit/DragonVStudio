using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.AdminGame
{
    public class BaseGameRequest<T>
    {
        public RequestMetaData MetaData { get; set; }
        [Required]
        public T Payload { get; set; }
        [Required]
        public string GameUrl { get; set; }
    }
}