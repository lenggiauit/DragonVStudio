using System;

namespace DragonVStudio.API.Resources
{
    public class NotificationResource
    {
        public Guid Id { get; set; }
        public string Message { get; set; }  
        public DateTime CreatedDate { get; set; }
    }
}
