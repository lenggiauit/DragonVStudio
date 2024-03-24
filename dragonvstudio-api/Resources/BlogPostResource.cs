using System;
using System.Collections.Generic;

namespace DragonVStudio.API.Resources
{
    public class BlogPostResource
    {
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Thumbnail { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public int View { get; set; }
        public int Comment { get; set; } 
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int TotalRows { get; set; }
        public UserResource User { get; set; }
        public  CategoryResource Category { get; set; }
        public  List<TagResource> Tags { get; set; } 
    }
}
