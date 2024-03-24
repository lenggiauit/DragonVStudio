using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class InviteConversationRequest
    {
        [Required]
        public Guid ConversationId { get; set; }
        [Required]
        public Guid[] Users { get; set; }
    }
}
