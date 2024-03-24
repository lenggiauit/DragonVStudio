using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IBlogService
    {
        Task<(List<Category>, ResultCode)> GetCategory();
        Task<(List<Tag>, ResultCode)> GetTags();
        Task<(List<BlogPost>, ResultCode)> GetTopPost();
        Task<(List<BlogPost>, ResultCode)> GetPosts(BaseRequest<BlogPostSearchRequest> request);
        Task<(BlogPost, ResultCode)> GetBlogPostDetail(string postUrl);
        Task<(List<BlogPost>, ResultCode)> GetRelatedPost(string categoryUrl, string notIn);
        Task<(List<Comment>, ResultCode)> GetComments(BaseRequest<CommmentRequest> request);
        Task<(Comment, ResultCode)> AddComment(BaseRequest<AddCommmentRequest> request, Guid userId);
        Task<ResultCode> RemoveComment(BaseRequest<RemoveCommmentRequest> request, Guid userId);
        Task<(List<BlogPost>, ResultCode)> GetBlogPostByCategory(BaseRequest<BlogPostByUrlRequest> request);
        Task<(List<BlogPost>, ResultCode)> GetBlogPostByTag(BaseRequest<BlogPostByUrlRequest> request);
        Task<(List<BlogPost>, ResultCode)> GetNewsPost();
    }
}
