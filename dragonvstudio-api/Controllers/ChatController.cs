using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Response;
using DragonVStudio.API.Infrastructure;
using DragonVStudio.API.Resources;
using DragonVStudio.API.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Controllers
{
    [Authorize]
    [Route("Chat")]
    public class ChatController : BaseController
    {
        private readonly IChatService _chatServices;
        private readonly ILogger<ChatController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        private readonly IHubContext<ConversationServiceHub> _chatServiceHub;

        public ChatController(
            ILogger<ChatController> logger,
            IMapper mapper,
            IChatService ChatServices,
           [NotNull]IHubContext<ConversationServiceHub> chatServiceHub,
            IOptions<AppSettings> appSettings) : base()
        {
            _chatServices = ChatServices;
            _chatServiceHub = chatServiceHub;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        // [Permissions("CreateConversation")]
        [HttpPost("CreateConversation")]
        public async Task<BaseResponse<ConversationResource>> CreateConversation([FromBody] BaseRequest<CreateConversationRequest> request)
        {
            if (ModelState.IsValid)
            {
                var conversation = await _chatServices.CreateConversation(GetCurrentUserId(), request);
                if (conversation != null)
                {
                    var resources = _mapper.Map<Conversation, ConversationResource>(conversation);
                    return new BaseResponse<ConversationResource>(resources);
                }
                else
                {
                    return new BaseResponse<ConversationResource>(Constants.UnknowMsg, ResultCode.Unknown);
                }

            }
            else
            {
                return new BaseResponse<ConversationResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }

        }

        // [Permissions("DeleteConversation")]
        [HttpPost("DeleteConversation")]
        public async Task<BaseResponse<ResultCode>> DeleteConversation([FromBody] BaseRequest<Guid> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _chatServices.DeleteConversation(GetCurrentUserId(), request);                 
                return new BaseResponse<ResultCode>(result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        // [Permissions("SendMessage")]
        [HttpPost("SendMessage")]
        public async Task<BaseResponse<ResultCode>> SendMessage([FromBody] BaseRequest<SendMessageRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _chatServices.SendMessage(GetCurrentUserId(), request);
                if (result != null)
                {
                    await _chatServiceHub.Clients.Group(request.Payload.ConversationId.ToString()).SendAsync("SendToConversation", JsonConvert.SerializeObject(result));
                    return new BaseResponse<ResultCode>(ResultCode.Success);
                }
                else
                {
                    return new BaseResponse<ResultCode>(Constants.UnknowMsg, ResultCode.Unknown);
                }
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }




       // [Permissions("InviteToConversation")]
        [HttpPost("InviteToConversation")]
        public async Task<BaseResponse<ResultCode>> InviteToConversation([FromBody] BaseRequest<InviteConversationRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _chatServices.InviteToConversation(request); 
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        // [Permissions("RemoveFromConversation")]
        [HttpPost("RemoveFromConversation")]
        public async Task<BaseResponse<ResultCode>> RemoveFromConversation([FromBody] BaseRequest<RemoveFromConversationRequest> request)
        {
            if (ModelState.IsValid)
            {
                var resultCode = await _chatServices.RemoveFromConversation(GetCurrentUserId(), request);
                return new BaseResponse<ResultCode>(resultCode);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        //[Permissions("GetConversationListByUser")]
        [HttpPost("GetConversationListByUser")]
        public async Task<BaseResponse<List<ConversationResource>>> GetConversationListByUser([FromBody] BaseRequest<GetConversationListRequest> request)
        {
            if (ModelState.IsValid)
            {
                var chatList = await _chatServices.GetConversationListByUser(GetCurrentUserId(), request);
                var resources = _mapper.Map<List<Conversation>, List<ConversationResource>>(chatList);
                return new BaseResponse<List<ConversationResource>>(resources);
            }
            else
            {
                return new BaseResponse<List<ConversationResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [HttpPost("GetMessagesByConversation")]
        public async Task<BaseResponse<List<ConversationMessageResource>>> GetMessagesByConversation([FromBody] BaseRequest<GetMessagesRequest> request)
        {
            if (ModelState.IsValid)
            {
                var chatList = await _chatServices.GetMessagesByConversation(GetCurrentUserId(), request);
                var resources = _mapper.Map<List<ConversationMessage>, List<ConversationMessageResource>>(chatList.OrderBy(c => c.SendDate).ToList());
                return new BaseResponse<List<ConversationMessageResource>>(resources);
            }
            else
            {
                return new BaseResponse<List<ConversationMessageResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }


        //[Permissions("SearchConversationer")]
        [HttpPost("ConversationalSearch")]
        public async Task<BaseResponse<List<ConversationResource>>> ConversationalSearch([FromBody] BaseRequest<ConversationalSearchRequest> request)
        {
            if (ModelState.IsValid)
            {
                var searchResult  = await _chatServices.ConversationalSearch(GetCurrentUser(), request);
                var resources = _mapper.Map<List<Conversation>, List<ConversationResource>>(searchResult);
                return new BaseResponse<List<ConversationResource>>(resources);
            }
            else
            {
                return new BaseResponse<List<ConversationResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        //[Permissions("SearchConversationer")]
        [HttpPost("MessengerSearch")]
        public async Task<BaseResponse<List<ConversationerResource>>> MessengerSearch([FromBody] BaseRequest<MessengerSearchRequest> request)
        {
            if (ModelState.IsValid)
            {
                var searchResult = await _chatServices.MessengerSearch(GetCurrentUser(), request);
                var resources = _mapper.Map<List<User>, List<ConversationerResource>>(searchResult);
                return new BaseResponse<List<ConversationerResource>>(resources);
            }
            else
            {
                return new BaseResponse<List<ConversationerResource>>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        



    }
}


