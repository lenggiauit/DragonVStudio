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
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    [Authorize]
    public class ConversationServiceHub : Hub
    {
        private readonly IChatService _chatServices;
        private readonly ILogger<ConversationServiceHub> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;

        public ConversationServiceHub(
            ILogger<ConversationServiceHub> logger,
            IMapper mapper,
            IChatService ChatServices,

            IOptions<AppSettings> appSettings) : base()
        {
            _chatServices = ChatServices;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        private readonly static ChatConnectionMapping<Guid> _chatConnections = new ChatConnectionMapping<Guid>();
        public Guid GetCurrentUserId()
        {
            var claimUser = Context.User.Claims.Where(c => c.Type == ClaimTypes.UserData).FirstOrDefault();
            if (claimUser != null)
            {
                User userResource = JsonConvert.DeserializeObject<User>(claimUser.Value);
                return userResource.Id;
            }
            else
            {
                return Guid.Empty;
            }
        }

        public async Task CheckConnectionStatus(Guid userId)
        {
            await Clients.Group(userId.ToString().ToLower().Trim()).SendAsync("onCheckConnectionStatus", "[Connected]");
        }

        public async Task InitConversations(Guid[] conversationIds)
        {
            foreach (var id in conversationIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id.ToString().ToLower().Trim());
            } 
        }

        public async Task StartConversation(Guid conversationId, string jsonConversation)
        { 
            try
            { 
                await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString().ToLower().Trim());
               
                var convResource = JsonConvert.DeserializeObject<ConversationResource>(jsonConversation);
                if (convResource != null)
                {
                    foreach (var user in convResource.Conversationers)
                    {
                        if (user.Id != GetCurrentUserId())
                        {
                            await Clients.Group(user.Id.ToString().ToLower().Trim()).SendAsync("onStartConversation", jsonConversation);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public async Task SendMessage(string jsonConversation)
        {
            try
            {
                var convMessageResource = JsonConvert.DeserializeObject<ConversationMessageResource>(jsonConversation);
                if (convMessageResource != null)
                {
                    await _chatServices.SaveMessage(GetCurrentUserId(), convMessageResource.ConversationId, convMessageResource.Id , convMessageResource.Message); 
                    await Clients.Group(convMessageResource.ConversationId.ToString().ToLower().Trim()).SendAsync("onReceivedMessage", jsonConversation);
                    await Clients.Group(convMessageResource.ConversationId.ToString().ToLower().Trim()).SendAsync("onConversationReceivedMessage", jsonConversation);
                    

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public async Task DeleteMessage(Guid conversationId, Guid messageId)
        {
            try
            {
                await Clients.Group(conversationId.ToString().ToLower().Trim()).SendAsync("onDeleteMessage", conversationId, messageId);
                await _chatServices.DeleteMessage(GetCurrentUserId(), conversationId, messageId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }



        public async Task InviteToConversation(Guid conversationId, Guid[] users)
        { 
            var resultCode = await _chatServices.InviteToConversation(new BaseRequest<InviteConversationRequest>()
            {
                Payload = new InviteConversationRequest() { ConversationId = conversationId, Users = users }
            });

            var conv = await _chatServices.GetConversationById(conversationId);
            if (conv != null)
            {
                try
                {
                    var resources = _mapper.Map<Conversation, ConversationResource>(conv);
                    var convStr = JsonConvert.SerializeObject(resources);
                    foreach (var u in users)
                    {
                        if (u != GetCurrentUserId())
                        {
                            await Clients.Group(u.ToString().ToLower().Trim()).SendAsync("onInviteToConversation", convStr);
                        }
                    }
                }
                catch(Exception e)
                {
                    _logger.LogError(e.Message);
                }
            }
        }


        public async Task RemoveFromConversation(Guid conversationId, Guid[] users)
        {

            var resultCode = await _chatServices.RemoveFromConversation(GetCurrentUserId(), new BaseRequest<RemoveFromConversationRequest>()
            {
                Payload = new RemoveFromConversationRequest() { ConversationId = conversationId, Users = users }
            });

            foreach (var u in users)
            {
                await Clients.Group(conversationId.ToString().ToLower().Trim()).SendAsync("onRemoveFromConversation", conversationId.ToString().ToLower().Trim(), u.ToString().ToLower().Trim());
            }
        }


        public async Task OnTyping(Guid conversationId, Guid userId)
        {
            await Clients.Group(conversationId.ToString().ToLower().Trim()).SendAsync("onUserTyping", conversationId.ToString().ToLower().Trim(), userId.ToString().ToLower().Trim());
            await Clients.Group(conversationId.ToString().ToLower().Trim()).SendAsync("onConversationTyping", conversationId.ToString().ToLower().Trim(), userId.ToString().ToLower().Trim());
        }
        public async Task OnInviting(Guid conversationId, Guid userId)
        {
            await Clients.Group(conversationId.ToString().ToLower().Trim()).SendAsync("onInviting", userId.ToString().ToLower().Trim());
        }
        public async Task AddToConversationGroup(Guid conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId.ToLower().Trim(), conversationId.ToString().ToLower().Trim());
        }
        public async Task RemoveFromConversationGroup(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId.ToLower().Trim(), conversationId.ToString().ToLower().Trim());
        }

        public override Task OnConnectedAsync()
        {
            Groups.AddToGroupAsync(Context.ConnectionId.ToLower().Trim(), GetCurrentUserId().ToString().ToLower().Trim()); 
            _chatConnections.Add(GetCurrentUserId(), Context.ConnectionId); 
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Groups.RemoveFromGroupAsync(Context.ConnectionId, GetCurrentUserId().ToString().Trim());
            _chatConnections.Remove(GetCurrentUserId(), Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task CheckNewMessages(Guid userId)
        {
            int count = await _chatServices.CheckNewMessagesByUser(GetCurrentUserId());  
            await Clients.Caller.SendAsync("onHaveNewMessages", count);
        }

        public async Task SetUserSeenMessages(List<Guid> userIds, Guid conversationId)
        {
             await _chatServices.SetUserSeenMessages(userIds, conversationId); 
        }

    }
}
