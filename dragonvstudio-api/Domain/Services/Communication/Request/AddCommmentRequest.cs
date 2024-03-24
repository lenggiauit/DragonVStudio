using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class AddCommmentRequest
    {
        [Required]
        public Guid PostId { get; set; }
        public Guid ParentId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string CommentContent { get; set; }
    }

    public class RemoveCommmentRequest
    {
        [Required]
        public Guid CommentId { get; set; }
    }
}
