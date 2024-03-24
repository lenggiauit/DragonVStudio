using System;

namespace DragonVStudio.API.Resources
{
    public class CommentResource
    {
        public Guid PostId { get; set; } 
        public Guid UserId { get; set; }
        public UserResource User { get; set; }
        public Guid? ParentId { get; set; }
        public string CommentContent { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
