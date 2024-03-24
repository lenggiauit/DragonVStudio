using System;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class CategoryRequest
    {
        public Guid Id { get; set; }
    }
    public class CategoryFilterRequest
    {
        public bool IsArchived { get; set; }
    }


}
