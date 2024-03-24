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
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlogPostFilterRequest = DragonVStudio.API.Domain.Services.Communication.Request.Admin.BlogPostFilterRequest;

namespace DragonVStudio.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class AdminController : BaseController
    {
        private readonly IAdminService _adminServices;
        private readonly IFileService _fireServices;
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<AdminController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public AdminController(
            ILogger<AdminController> logger,
            IMapper mapper,
            IAdminService adminService,
            IFileService fireServices,
            IHttpClientFactoryService httpClientFactoryService,
            IOptions<AppSettings> appSettings)
        {
            _adminServices = adminService;
            _fireServices = fireServices;
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [HttpPost("GetCategory")]
        public async Task<BaseResponse<List<Category>>> GetCategory(BaseRequest<CategoryFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<List<Category>>(await _adminServices.GetCategory(request));
            }
            else
            {
                return new BaseResponse<List<Category>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("CheckCategoryName")]
        public async Task<BaseResponse<ResultCode>> CheckCategoryName(string name, Guid? categoryid)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var result = await _adminServices.CheckCategoryName(name, categoryid);
                return new BaseResponse<ResultCode>(result);
            }
            else
            {
                return new BaseResponse<ResultCode>(ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.CreateEditCategory)]
        [HttpPost("CreateEditCategory")]
        public async Task<BaseResponse<Category>> CreateEditCategory(BaseRequest<CreateEditCategoryRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<Category>(await _adminServices.CreateEditCategory(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<Category>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetBlogPost")]
        public async Task<BaseResponse<List<BlogPost>>> GetBlogPost(BaseRequest<BlogPostFilterRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<List<BlogPost>>(await _adminServices.GetBlogPost(request));
            }
            else
            {
                return new BaseResponse<List<BlogPost>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpGet("CheckBlogPostTitle")]
        public async Task<BaseResponse<ResultCode>> CheckBlogPostTitle(string title, Guid? blogPostId)
        {
            if (!string.IsNullOrEmpty(title))
            {
                var result = await _adminServices.CheckBlogPostTitle(title, blogPostId);
                return new BaseResponse<ResultCode>(result);
            }
            else
            {
                return new BaseResponse<ResultCode>(ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.CreateEditBlogPost)]
        [HttpPost("CreateEditBlogPost")]
        public async Task<BaseResponse<BlogPost>> CreateEditBlogPost(BaseRequest<CreateEditBlogPostRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<BlogPost>(await _adminServices.CreateEditBlogPost(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<BlogPost>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.CreateEditBlogPost)]
        [HttpPost("UpdateBlogPostStatus")]
        public async Task<BaseResponse<ResultCode>> UpdateBlogPostStatus(BaseRequest<UpdateBlogPostStatusRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<ResultCode>(await _adminServices.UpdateBlogPostStatus(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        

 
 
         
        [Permissions(PermissionConstant.ManageUser)]

        [HttpPost("GetUserList")]
        public async Task<BaseResponse<List<UserListResource>>> GetUserList()
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _adminServices.GetUserList();
                if (data != null)
                {
                    return new BaseResponse<List<UserListResource>>(_mapper.Map<List<User>, List<UserListResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<UserListResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<UserListResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        [Permissions(PermissionConstant.ManageFileSharing)]
        [HttpPost("AddUpdateFileSharing")]
        public async Task<BaseResponse<(FileSharing, ResultCode)>> AddUpdateFileSharing(BaseRequest<AddUpdateFileSharingRequest> request)
        {

            if (ModelState.IsValid)
            {
                return new BaseResponse<(FileSharing, ResultCode)>(await _fireServices.AddUpdateFileSharing(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<(FileSharing, ResultCode)>(Constants.InvalidMsg, ResultCode.Invalid);
            } 
        }

        [Permissions(PermissionConstant.ManageFileSharing)]
        [HttpPost("GetFileSharing")]
        public async Task<BaseResponse<List<FileSharing>>> GetFileSharing(BaseRequest<FileSharingSearchRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _fireServices.GetAdminFileSharing(request, GetCurrentUserId());
                return new BaseResponse<List<FileSharing>>(data);
            }
            else
            {
                return new BaseResponse<List<FileSharing>>(Constants.InvalidMsg, ResultCode.Invalid);
            }

        }

        [Permissions(PermissionConstant.ManageFileSharing)]
        [HttpPost("RemoveFileSharing")]
        public async Task<BaseResponse<ResultCode>> RemoveFileSharing(BaseRequest<RequestId> request)
        {

            if (ModelState.IsValid)
            {
                return new BaseResponse<ResultCode>(await _fireServices.RemoveFileSharing(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }

        }

        [Permissions(PermissionConstant.ManageUser)]

        [HttpPost("GetFeedbackList")]
        public async Task<BaseResponse<List<FeedbackListResource>>> GetFeedbackList(BaseRequest<GetFeedbackRequest> request)
        {
            if (ModelState.IsValid)
            {
                var (data, resultCode) = await _adminServices.GetFeedbackList(request);
                if (data != null)
                {
                    return new BaseResponse<List<FeedbackListResource>>(_mapper.Map<List<Feedback>, List<FeedbackListResource>>(data));
                }
                else
                {
                    return new BaseResponse<List<FeedbackListResource>>(Constants.ErrorMsg, resultCode);
                }
            }
            else
            {
                return new BaseResponse<List<FeedbackListResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [Permissions(PermissionConstant.ManageUser)]
        [HttpPost("UpdateFeedbackStatus")]
        public async Task<BaseResponse<ResultCode>> UpdateFeedbackStatus(BaseRequest<Guid> request)
        {

            if (ModelState.IsValid)
            {
                return new BaseResponse<ResultCode>(await _adminServices.UpdateFeedbackStatus(request.Payload, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }

        }

        [Permissions(PermissionConstant.ManageUser)]
        [HttpPost("RemoveFeedback")]
        public async Task<BaseResponse<ResultCode>> RemoveFeedback(BaseRequest<Guid> request)
        {

            if (ModelState.IsValid)
            {
                return new BaseResponse<ResultCode>(await _adminServices.RemoveFeedback(request.Payload, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }

        }


    }
}
