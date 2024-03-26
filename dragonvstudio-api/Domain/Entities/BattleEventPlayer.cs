using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class BattleEventPlayer: BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        [MaxLength(250)]
        public string PlayerId { get; set; }
        [MaxLength(250)]
        public string DiscordId { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Class { get; set; }
        public int Team { get; set; }
    }
}
