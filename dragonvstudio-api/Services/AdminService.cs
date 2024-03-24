using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlogPostFilterRequest = DragonVStudio.API.Domain.Services.Communication.Request.Admin.BlogPostFilterRequest;

namespace DragonVStudio.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<AdminService> _logger;

        public AdminService(IAdminRepository adminRepository, IEmailService emailService, ILogger<AdminService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _adminRepository = adminRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

         
        public async Task<ResultCode> CheckBlogPostTitle(string title, Guid? blogPostId)
        {
            return await _adminRepository.CheckBlogPostTitle(title, blogPostId);
        }

        public async Task<ResultCode> CheckCategoryName(string name, Guid? categoryid)
        {
            return await _adminRepository.CheckCategoryName(name, categoryid);
        }

        public async Task<(BlogPost, ResultCode)> CreateEditBlogPost(BaseRequest<CreateEditBlogPostRequest> request, Guid userId)
        {
            return await _adminRepository.CreateEditBlogPost(request, userId);
        }

        public async Task<(Category, ResultCode)> CreateEditCategory(BaseRequest<CreateEditCategoryRequest> request, Guid userId)
        {
            return await _adminRepository.CreateEditCategory(request, userId);
        }

 

        public async Task<(List<BlogPost>, ResultCode)> GetBlogPost(BaseRequest<BlogPostFilterRequest> request)
        {
            return await _adminRepository.GetBlogPost(request);
        }

        public async Task<(List<Category>, ResultCode)> GetCategory(BaseRequest<CategoryFilterRequest> request)
        {
            return await _adminRepository.GetCategory(request);
        } 

        public async Task<(List<Feedback>, ResultCode)> GetFeedbackList(BaseRequest<GetFeedbackRequest> request)
        {
            return await _adminRepository.GetFeedbackList(request);
        }

        public Task<(List<User>, ResultCode)> GetUserList()
        {
            throw new NotImplementedException();
        }

        public async Task<ResultCode> RemoveFeedback(Guid id, Guid userId)
        {
            return await _adminRepository.RemoveFeedback(id, userId);
        }

        public async Task<ResultCode> UpdateBlogPostStatus(BaseRequest<UpdateBlogPostStatusRequest> request, Guid userId)
        {
            return await _adminRepository.UpdateBlogPostStatus(request, userId);
        }

        public async Task<ResultCode> UpdateFeedbackStatus(Guid id, Guid userId)
        {
            return await _adminRepository.UpdateFeedbackStatus(id, userId);
        }

        
    }
}
