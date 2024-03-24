namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class BlogPostFilterRequest
    {
        public string Keywords { get; set; }
        public bool? IsAll { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsDraft { get; set; }
        public bool? IsArchived { get; set; } 
    }
}
