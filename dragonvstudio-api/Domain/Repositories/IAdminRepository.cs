using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlogPostFilterRequest = DragonVStudio.API.Domain.Services.Communication.Request.Admin.BlogPostFilterRequest;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IAdminRepository
    {
        Task<(List<Category>, ResultCode)> GetCategory(BaseRequest<CategoryFilterRequest> request);
        Task<ResultCode> CheckCategoryName(string name, Guid? categoryid);
        Task<(Category, ResultCode)> CreateEditCategory(BaseRequest<CreateEditCategoryRequest> request, Guid userId);
        Task<ResultCode> CheckBlogPostTitle(string title, Guid? blogPostId);
        Task<(BlogPost, ResultCode)> CreateEditBlogPost(BaseRequest<CreateEditBlogPostRequest> request, Guid userId);
        Task<(List<BlogPost>, ResultCode)> GetBlogPost(BaseRequest<BlogPostFilterRequest> request);
        Task<ResultCode> UpdateBlogPostStatus(BaseRequest<UpdateBlogPostStatusRequest> request, Guid userId);
       
        
        Task<(List<Feedback>, ResultCode)> GetFeedbackList(BaseRequest<GetFeedbackRequest> request);
        Task<ResultCode> RemoveFeedback(Guid id, Guid userId);
        Task<ResultCode> UpdateFeedbackStatus(Guid id, Guid userId);
    }
}
