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

 
[Route("[controller]")]
[ApiController]
public class NotificationController : BaseController
{
    private readonly INotificationService _notificationServices;
    private readonly IHttpClientFactoryService _httpClientFactoryService;
    private readonly ILogger<NotificationController> _logger;
    private readonly AppSettings _appSettings;
    private IMapper _mapper;
    public NotificationController(
        ILogger<NotificationController> logger,
        IMapper mapper,
        INotificationService notificationServices,
        IHttpClientFactoryService httpClientFactoryService,
        IOptions<AppSettings> appSettings)
    {
        _notificationServices = notificationServices;
        _httpClientFactoryService = httpClientFactoryService;
        _logger = logger;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [HttpPost("GetNotificationCount")]
    public async Task<BaseResponse<int>> GetNotificationCount()
    {
        if (ModelState.IsValid)
        {
            return new BaseResponse<int>(await _notificationServices.GetNotificationCount(GetCurrentUserId()));
        }
        else
        {
            return new BaseResponse<int>(Constants.InvalidMsg, ResultCode.Invalid);
        }
    }

    [HttpPost("GetNotification")] 
    public async Task<BaseResponse<List<NotificationResource>>> GetNotification()
    {
        if (ModelState.IsValid)
        {
            var (data, resultCode) = await _notificationServices.GetNotification(GetCurrentUserId());
            if (data != null)
            {
                return new BaseResponse<List<NotificationResource>>(_mapper.Map<List<Notification>, List<NotificationResource>>(data));
            }
            else
            {
                return new BaseResponse<List<NotificationResource>>(Constants.ErrorMsg, resultCode);
            }

        }
        else
        {
            return new BaseResponse<List<NotificationResource>>(Constants.InvalidMsg, ResultCode.Invalid);
        }
    }

    [HttpPost("Remove")]
    public async Task<BaseResponse<ResultCode>> Remove(BaseRequest<Guid> request)
    {
        if (ModelState.IsValid)
        {
            return new BaseResponse<ResultCode>(await _notificationServices.Remove(request.Payload, GetCurrentUserId()));
        }
        else
        {
            return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        }
    }

    [HttpPost("RemoveAll")]
    public async Task<BaseResponse<ResultCode>> RemoveAll()
    {
        if (ModelState.IsValid)
        {
            return new BaseResponse<ResultCode>(await _notificationServices.RemoveAll(GetCurrentUserId()));
        }
        else
        {
            return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
        }
    }




}
