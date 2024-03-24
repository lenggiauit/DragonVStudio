using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonVStudio.API.Domain.Entities
{
    public class PostComment : BaseEntity
    {
        public Guid? ParentId { get; set; }
        public string Content { get; set; } 
        public bool IsDeleted { get; set; }
         
        [ForeignKey("BlogPost")]
        public Guid BlogPostId { get; set; }

        [NotMapped]
        public virtual User User { get; set; }
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
