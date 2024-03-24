using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio_API.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    [ApiController]
    public class BlogController : BaseController
    {
        private readonly IBlogService _blogServices;
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<BlogController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public BlogController(
            ILogger<BlogController> logger,
            IMapper mapper,
            IBlogService blogService,
            IHttpClientFactoryService httpClientFactoryService,
            IOptions<AppSettings> appSettings)
        {
            _blogServices = blogService;
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        
        [HttpGet("GetCategory")]
        public async Task<BaseResponse<List<CategoryResource>>> GetCategory()
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetCategory();
                if (data != null)
                {
                    return new BaseResponse<List<CategoryResource>>(_mapper.Map<List<Category>, List<CategoryResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<CategoryResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<CategoryResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("GetTags")]
        public async Task<BaseResponse<List<TagResource>>> GetTags()
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetTags();
                if (data != null)
                {
                    return new BaseResponse<List<TagResource>>(_mapper.Map<List<Tag>, List<TagResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<TagResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<TagResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("GetTopPost")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetTopPost()
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetTopPost();
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map<List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("GetNewsPost")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetNewsPost()
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetNewsPost();
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map<List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetBlogPost")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetBlogPost(BaseRequest<BlogPostSearchRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetPosts(request);
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map<List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetBlogPostByCategory")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetBlogPostByCategory(BaseRequest<BlogPostByUrlRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetBlogPostByCategory(request);
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map<List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetBlogPostByTag")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetBlogPostByTag(BaseRequest<BlogPostByUrlRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetBlogPostByTag(request);
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map<List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [HttpGet("GetBlogPostDetail")]
        public async Task<BaseResponse<BlogPostResource>> GetBlogPostDetail(string postUrl)
        {
            if (!string.IsNullOrEmpty(postUrl))
            {
                var (data, resultCode) = await _blogServices.GetBlogPostDetail(postUrl);
                if (data != null)
                {
                    return new BaseResponse<BlogPostResource>(_mapper.Map<BlogPost, BlogPostResource>(data));
                }
                else
                {
                    return new BaseResponse<BlogPostResource>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<BlogPostResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("GetRelatedPost")]
        public async Task<BaseResponse<List<BlogPostResource>>> GetRelatedPost(string category, string notIn)
        {
            if (!string.IsNullOrEmpty(category))
            {
                var (data, resultCode) = await _blogServices.GetRelatedPost(category, notIn);
                if (data != null)
                {
                    return new BaseResponse<List<BlogPostResource>>(_mapper.Map< List<BlogPost>, List<BlogPostResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<BlogPostResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<BlogPostResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetComments")]
        public async Task<BaseResponse<List<CommentResource>>> GetComments(BaseRequest<CommmentRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.GetComments(request);
                if (data != null)
                {
                    return new BaseResponse<List<CommentResource>>(_mapper.Map<List<Comment>, List<CommentResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<CommentResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<CommentResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("AddComment")]
        public async Task<BaseResponse<CommentResource>> AddComment(BaseRequest<AddCommmentRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _blogServices.AddComment(request, GetCurrentUserId());
                if (data != null)
                {
                    return new BaseResponse<CommentResource>(_mapper.Map<Comment, CommentResource>(data));
                }
                else
                {
                    return new BaseResponse<CommentResource>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<CommentResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("RemoveComment")]
        public async Task<BaseResponse<ResultCode>> RemoveComment(BaseRequest<RemoveCommmentRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _blogServices.RemoveComment(request, GetCurrentUserId());
                
                return new BaseResponse<ResultCode>(resultCode);
               
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }




    }
}
