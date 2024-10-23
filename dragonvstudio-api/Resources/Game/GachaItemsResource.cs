using System;

namespace DragonVStudio.API.Resources.Game
{
    public class GachaItemsResource
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
