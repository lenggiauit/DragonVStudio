using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace DragonVStudio.API.Domain.Entities
{
    public class Comment : BaseEntity
    {
        public Guid PostId { get; set; }
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public Guid? ParentId { get; set; }
        public string CommentContent { get; set; } 
        public bool IsDeleted { get; set; } 
        public int TotalRows { get; set; }
    }
}
