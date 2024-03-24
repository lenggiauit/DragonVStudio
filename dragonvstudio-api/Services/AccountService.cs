using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountServiceRepository;
        private readonly INotificationRepository _notifyRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<AccountService> _logger;

        public AccountService(IAccountRepository accountServiceRepository, INotificationRepository notificationRepository, IEmailService emailService, ILogger<AccountService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _accountServiceRepository = accountServiceRepository;
            _notifyRepository = notificationRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<ResultCode> CheckEmail(string email)
        {
            return await _accountServiceRepository.CheckEmail(email);
        }

        public async Task<ResultCode> CheckEmailWithUser(string email, Guid id)
        {
            return await _accountServiceRepository.CheckEmailWithUser(email, id);
        }

        public async Task<ResultCode> CheckUserName(string userName)
        {
            return await _accountServiceRepository.CheckUserName(userName);
        }

        public async Task<ResultCode> SendFeedback(BaseRequest<FeedbackRequest> request, Guid userId)
        {
            return await _accountServiceRepository.SendFeedback(request, userId);
        }

        public async Task<ResultCode> ForgotPassword(string email)
        {
            var user = await _accountServiceRepository.GetByEmail(email);
            if (user != null)
            {
                try
                {
                    long expireTime = DateTime.Now.AddDays(1).ToUniversalTime().Ticks;
                    string resetPasswordUrl = string.Format("{0}?code={1}", _appSettings.ForgotPasswordUrl, EncryptionHelper.Encrypt(user.Id.ToString() + "_" + expireTime.ToString(), _appSettings.Secret));
                    
                    string smtpPwd = EncryptionHelper.Decrypt(_appSettings.SmtpPass, Constants.PassDecryptKey);

                    await _emailService.Send(email,
                        _appSettings.MailForgotPasswordSubject,
                        string.Format(_appSettings.MailForgotPasswordContent, user.UserName, resetPasswordUrl), smtpPwd);
                    await _notifyRepository.SendNotification("[SendEmailForgotPasswordSuccess]", user.Id);
                    return ResultCode.Success;
                }
                catch (Exception e)
                {
                    _logger.LogError(e.Message);
                    return ResultCode.Error;
                }
            }
            else
            {
                return ResultCode.NotExistEmail;
            }
        }

        public async Task<User> GetById(Guid id)
        {
            return await _accountServiceRepository.GetById(id);
        }
         
        public async Task<User> Login(string name, string password)
        {
            return await _accountServiceRepository.Login(name, password);
        }

        public async Task<User> LoginWithGoogle(string email)
        {
            return await _accountServiceRepository.LoginWithGoogle(email);
        }

        public async Task<ResultCode> Register(string name, string email, string password)
        {
            return await _accountServiceRepository.Register(name, email, password);
        }

        public async Task<ResultCode> Register( string name, string email, string password, string fullname, string avatar)
        {
            return await _accountServiceRepository.Register(name, email, password, fullname, avatar);
        }

        

        public async Task<ResultCode> RegisterWithDiscord(string discordId, string discordName, string name, string email, string password, string fullname, string avatar)
        {
            return await _accountServiceRepository.RegisterWithDiscord(discordId, discordName, name, email, password, fullname, avatar);
        }

        public async Task<ResultCode> ResetPassword(string userInfo, string newPassword)
        {
            try
            {
                string decryptedStr = EncryptionHelper.Decrypt(userInfo, _appSettings.Secret);

                Guid userId = Guid.Parse(decryptedStr.Split('_')[0]);
                long expireTime = long.Parse(decryptedStr.Split('_')[1]);
                if (expireTime > DateTime.Now.ToUniversalTime().Ticks)
                {
                    var user = await _accountServiceRepository.GetById(userId);
                    if (user != null)
                    {
                        await _accountServiceRepository.UpdateUserPasword(userId, newPassword);
                        await _unitOfWork.CompleteAsync();
                        await _notifyRepository.SendNotification("[ResetPasswordSuccess]", userId);
                        return ResultCode.Success;
                    }
                    else
                    {
                        return ResultCode.NotExistUser;
                    }
                }
                else
                {
                    return ResultCode.Expired;
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return ResultCode.Error;
            }
        }

        public async Task<ResultCode> UpdateProfile(Guid userId, BaseRequest<UpdateProfileRequest> request)
        {
            try
            { 
                if (await _accountServiceRepository.UpdateProfile(userId, request.Payload))
                { 
                    await _unitOfWork.CompleteAsync();
                    await _notifyRepository.SendNotification("[UpdateProfileSuccess]", userId);
                    return ResultCode.Success;
                }
                else
                {
                    return ResultCode.NotExistUser;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<ResultCode> UpdateUserAvatar(Guid userId, BaseRequest<UpdateUserAvatarRequest> request)
        {
            try
            { 
                if (await _accountServiceRepository.UpdateUserAvatar(userId, request.Payload.Avatar))
                { 
                    await _unitOfWork.CompleteAsync();
                    await _notifyRepository.SendNotification("[UpdateUserAvatarSuccess]", userId);
                    return (ResultCode.Success);
                }
                else
                {
                    return (ResultCode.NotExistUser);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return (ResultCode.Error);
            }
        }

        public async Task<User> LoginWithDiscord(string discordId)
        {
            return await _accountServiceRepository.LoginWithDiscord(discordId);
        }

        public async Task<ResultCode> ChangePassword(string userInfo, string newPassword)
        {
            try
            { 
                Guid userId = Guid.Parse(userInfo);
 
                var user = await _accountServiceRepository.GetById(userId);
                if (user != null)
                {
                    await _accountServiceRepository.UpdateUserPasword(userId, newPassword);
                    await _unitOfWork.CompleteAsync();
                    await _notifyRepository.SendNotification("[ChangePasswordSuccess]", userId);
                    return ResultCode.Success;
                }
                else
                {
                    return ResultCode.NotExistUser;
                }
                 
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return ResultCode.Error;
            }
        }

        public async Task<ResultCode> ConnectWithDiscord(Guid userId, string discordId, string discordName)
        {
            var result = await _accountServiceRepository.ConnectWithDiscord(userId, discordId, discordName);
            if (result == ResultCode.Success)
            {
                await _notifyRepository.SendNotification("[ConnectWithDiscordSuccess]", userId);
                return ResultCode.Success;
            }
            else
            {
                return ResultCode.Error;    
            }
            
        }
    }
}
