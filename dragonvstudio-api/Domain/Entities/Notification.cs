using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(250)]
        public string Message { get; set; }
        public Guid UserId { get; set; }  
        public Guid? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

    }
}
