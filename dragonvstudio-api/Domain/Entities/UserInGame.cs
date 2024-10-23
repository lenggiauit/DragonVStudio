using Org.BouncyCastle.Bcpg;
using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class UserInGame : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        public Guid UserId { get; set; }
        
        [MaxLength(250)]
        public string PlayerId { get; set; }
    }
}
