using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class GachaItem : BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Code { get; set; }

        public int Quantity { get; set; }
        public bool IsActive { get; set; }

    }
}
