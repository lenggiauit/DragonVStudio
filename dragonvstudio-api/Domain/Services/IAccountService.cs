using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request; 
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IAccountService
    {
        Task<User> GetById(Guid id);
        Task<User> Login(string name, string password);
        Task<User> LoginWithGoogle(string email);
        Task<ResultCode> Register(string name, string email, string password); 
        Task<ResultCode> Register(string name, string email, string password, string fullname, string avatar);
        Task<ResultCode> RegisterWithDiscord(string discordId, string discordName, string name, string email, string password, string fullname, string avatar); 
        Task<ResultCode> CheckEmail(string email);
        Task<ResultCode> CheckUserName(string userName);
        Task<ResultCode> ForgotPassword(string email);
        Task<ResultCode> ResetPassword(string userInfo, string newPassword);
        Task<ResultCode> UpdateProfile(Guid userId, BaseRequest<UpdateProfileRequest> request);
        Task<ResultCode> UpdateUserAvatar(Guid userId,BaseRequest<UpdateUserAvatarRequest> request);
        Task<ResultCode> CheckEmailWithUser(string email, Guid id);
        Task<ResultCode> SendFeedback(BaseRequest<FeedbackRequest> request, Guid userId);
        Task<User> LoginWithDiscord(string discordId);
        Task<ResultCode> ChangePassword(string userInfo, string newPassword);
        Task<ResultCode> ConnectWithDiscord(Guid userId, string discordId, string discordName);
    }
}
