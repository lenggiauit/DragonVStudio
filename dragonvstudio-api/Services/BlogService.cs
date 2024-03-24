using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<BlogService> _logger;

        public BlogService(IBlogRepository blogRepository, IEmailService emailService, ILogger<BlogService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _blogRepository = blogRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<(Comment, ResultCode)> AddComment(BaseRequest<AddCommmentRequest> request, Guid userId)
        {
            return await _blogRepository.AddComment(request, userId);
        }

        public async Task<(List<BlogPost>, ResultCode)> GetBlogPostByCategory(BaseRequest<BlogPostByUrlRequest> request)
        {
            return await _blogRepository.GetBlogPostByCategory(request);
        }

        public async Task<(List<BlogPost>, ResultCode)> GetBlogPostByTag(BaseRequest<BlogPostByUrlRequest> request)
        {
            return await _blogRepository.GetBlogPostByTag(request);
        }

        public async Task<(BlogPost, ResultCode)> GetBlogPostDetail(string postUrl)
        {
            return await _blogRepository.GetBlogPostDetail(postUrl);
        }

        public async Task<(List<Category>, ResultCode)> GetCategory()
        {
            return await _blogRepository.GetCategory();
        }

        public async Task<(List<Comment>, ResultCode)> GetComments(BaseRequest<CommmentRequest> request)
        {
            return await _blogRepository.GetComments(request);
        }

        public async Task<(List<BlogPost>, ResultCode)> GetNewsPost()
        {
            return await _blogRepository.GetNewsPost();
        }

        public async Task<(List<BlogPost>, ResultCode)> GetPosts(BaseRequest<BlogPostSearchRequest> request)
        {
            return await _blogRepository.GetPosts(request);
        }

        public async Task<(List<BlogPost>, ResultCode)> GetRelatedPost(string categoryUrl, string notIn)
        {
            return await _blogRepository.GetRelatedPost(categoryUrl, notIn);
        }

        public async Task<(List<Tag>, ResultCode)> GetTags()
        {
            return await _blogRepository.GetTags();
        }

        public async Task<(List<BlogPost>, ResultCode)> GetTopPost()
        {
            return await _blogRepository.GetTopPost();
        }

        public async Task<ResultCode> RemoveComment(BaseRequest<RemoveCommmentRequest> request, Guid userId)
        {
            return await _blogRepository.RemoveComment(request, userId);
        }
    }
}