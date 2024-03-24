using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonVStudio.API.Domain.Entities
{
    public class Feedback : BaseEntity
    {
        public double Rating { get; set; }

        public string Comment { get; set; }
        public bool IsPulished { get; set; } 
       
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public virtual User User { get; set; } 
        [NotMapped]
        public int TotalRows { get; set; }
    }
}
