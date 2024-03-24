using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IChatRepository
    {
        Task<List<Conversation>> GetConversationListByUser(Guid userId, BaseRequest<GetConversationListRequest> request, AppSettings appSettings);
        
        Task<Conversation> CreateConversation(Guid userId, BaseRequest<CreateConversationRequest> request);
        Task<ResultCode> InviteToConversation(BaseRequest<InviteConversationRequest> request);
        Task<ConversationMessage> SendMessage(Guid userId, BaseRequest<SendMessageRequest> request);
        Task SaveMessage(Guid userId, Guid conversationId, Guid msId, string message);
        Task<List<ConversationMessage>> GetMessagesByConversation(object userId, BaseRequest<GetMessagesRequest> request);
        Task<List<Conversation>> ConversationalSearch(User currentUser, BaseRequest<ConversationalSearchRequest> request);
        Task<ResultCode> DeleteConversation(Guid userId, BaseRequest<Guid> request);
        Task<int> CheckNewMessagesByUser(Guid userId);
        Task<List<User>> MessengerSearch(User user, BaseRequest<MessengerSearchRequest> request);
        Task<ResultCode> RemoveFromConversation(Guid userId, BaseRequest<RemoveFromConversationRequest> request);
        Task DeleteMessage(Guid userId, Guid coversationId, Guid messageId);
        Task<Conversation> GetConversationById(Guid conversationId);
        Task SetUserSeenMessages(List<Guid> userIds, Guid conversationId);
    }
}
