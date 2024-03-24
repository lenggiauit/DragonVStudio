using System;

namespace DragonVStudio.API.Resources
{
    public class FeedbackListResource
    {
        public Guid Id { get; set; }
        public double Rating { get; set; } 
        public string Comment { get; set; }
        public bool IsPulished { get; set; } 
        public UserResource User { get; set; } 
        public int TotalRows { get; set; }
    }
}
