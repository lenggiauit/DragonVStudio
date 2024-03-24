using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonVStudio.API.Domain.Entities
{
    public class FileSharing : BaseEntity
    {
        [MaxLength(250)]
        public string Category { get; set; }
        [MaxLength(250)]
        public string Name { get; set; } 
        [MaxLength(350)]
        public string Url { get; set; }
        public bool IsArchived { get; set; }

        [NotMapped]
        public int TotalRows { get; set; }
    }
}
