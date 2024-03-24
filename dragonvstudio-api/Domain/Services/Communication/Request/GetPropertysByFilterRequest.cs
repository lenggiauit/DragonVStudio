using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class GetPropertysByFilterRequest
    {
        public Guid? TypeId { get; set; }
        public bool IsArchived { get; set; }

    }
}
