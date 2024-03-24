using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace DragonVStudio.API.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class AccountController : BaseController
    {
        private readonly IAccountService _accountServices; 
        private readonly IHttpClientFactoryService _httpClientFactoryService;
        private readonly ILogger<AccountController> _logger;
        private readonly AppSettings _appSettings;
        private IMapper _mapper;
        public AccountController(
            ILogger<AccountController> logger,
            IMapper mapper,
            IAccountService accountService, 
            IHttpClientFactoryService httpClientFactoryService,
            IOptions<AppSettings> appSettings)
        {
            _accountServices = accountService; 
            _httpClientFactoryService = httpClientFactoryService;
            _logger = logger;
            _mapper = mapper;
            _appSettings = appSettings.Value; 
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<BaseResponse<UserResource>> Login([FromBody] BaseRequest<AuthenticateRequest> request)
        {
            if (ModelState.IsValid)
            {
                var user = await _accountServices.Login( request.Payload.Name, request.Payload.Password );
                if (user != null)
                {
                    var resources = _mapper.Map<User, UserResource>(user);
                    AccessToken accessToken = new AccessToken(); 
                    resources.AccessToken = accessToken.GenerateToken(user, _appSettings.Secret); 
                    return new BaseResponse<UserResource>(resources);
                }
                else
                {
                    return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.NotExistUser);
                }
            }
            else
            {
                return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [AllowAnonymous]
        [HttpGet("LoginCodeWithDiscord")]
        public RedirectResult LoginCodeWithDiscord()
        {
            string url = string.Format(_appSettings.DiscordAuthenticationUrl, _appSettings.DiscordClientId, _appSettings.DiscordAuthenticationLoginRedirectUrl);
            return Redirect(url);
        }

        [AllowAnonymous]
        [HttpGet("LoginWithDiscord")]
        public async Task<BaseResponse<UserResource>> LoginWithDiscord(string access_token)
        {
            try
            { 
                var discordApiResponse = _httpClientFactoryService.GetBearerAuthorizeAsync(_appSettings.DiscordApisUrl, access_token).Result;
                if (discordApiResponse != null)
                {
                    var user = await _accountServices.LoginWithDiscord(discordApiResponse["id"].ToString());
                    if (user != null)
                    {
                        var resources = _mapper.Map<User, UserResource>(user);
                        AccessToken accessToken = new AccessToken();
                        resources.AccessToken = accessToken.GenerateToken(user, _appSettings.Secret);
                        return new BaseResponse<UserResource>(resources);
                    }
                    else
                    {
                        return new BaseResponse<UserResource>(Constants.UnknowMsg, ResultCode.NotExistEmail);
                    }
                }
                else
                {
                    return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Unknown);
                } 
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Error);
            }
        }

        [AllowAnonymous]
        [HttpGet("LoginWithGoogle")]
        public async Task<BaseResponse<UserResource>> LoginWithGoogle(string access_token)
        {
            try
            {
                var googleApiResponse = _httpClientFactoryService.GetAsync(string.Format(_appSettings.GoogleApisUrl, access_token)).Result;
                if (googleApiResponse != null)
                {
                    var user = await _accountServices.LoginWithGoogle(googleApiResponse["email"].ToString());
                    if (user != null)
                    {
                        var resources = _mapper.Map<User, UserResource>(user);
                        AccessToken accessToken = new AccessToken(); 
                        resources.AccessToken = accessToken.GenerateToken(user, _appSettings.Secret); 
                        return new BaseResponse<UserResource>(resources);
                    }
                    else
                    {
                        return new BaseResponse<UserResource>(Constants.UnknowMsg, ResultCode.NotExistEmail);
                    }
                }
                else
                {
                    return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Unknown);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Error);
            }
        }

        [AllowAnonymous]
        [HttpGet("LoginWithFaceBook")]
        public async Task<BaseResponse<UserResource>> LoginWithFaceBook(string userId, string access_token)
        {
            try
            {
                var facebookApiResponse = _httpClientFactoryService.GetAsync(string.Format(_appSettings.FacebookApisUrl, access_token)).Result;
                if (facebookApiResponse != null)
                {
                    var user = await _accountServices.LoginWithGoogle(facebookApiResponse["email"].ToString());
                    if (user != null)
                    {
                        var resources = _mapper.Map<User, UserResource>(user);
                        AccessToken accessToken = new AccessToken();
                        resources.AccessToken = accessToken.GenerateToken(user, _appSettings.Secret);
                        return new BaseResponse<UserResource>(resources);
                    }
                    else
                    {
                        return new BaseResponse<UserResource>(Constants.UnknowMsg, ResultCode.NotExistEmail);
                    }
                }
                else
                {
                    return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Unknown);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new BaseResponse<UserResource>(Constants.InvalidMsg, ResultCode.Error);
            }
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<BaseResponse<ResultCode>> Register([FromBody] BaseRequest<RegisterRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.Register(request.Payload.UserName, request.Payload.Email, request.Payload.Password);
                return new BaseResponse<ResultCode>(string.Empty, result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }

        [AllowAnonymous]
        [HttpGet("RegisterWithDiscord")]
        public RedirectResult RegisterWithDiscord()
        { 
            string url = string.Format( _appSettings.DiscordAuthenticationUrl, _appSettings.DiscordClientId, _appSettings.DiscordAuthenticationRedirectUrl, "");
            return Redirect(url);
        }


        [AllowAnonymous]
        [HttpGet("ConnectingWithDiscord")]
        public RedirectResult ConnectingWithDiscord(string userId)
        {
            string url = string.Format(_appSettings.DiscordAuthenticationUrl, _appSettings.DiscordClientId,   _appSettings.ConnectWithDiscordRedirectUrl, userId);
            return Redirect(url);
        }
        [AllowAnonymous]
        [HttpGet("ConnectWithDiscord")]
        public async Task<RedirectResult> ConnectWithDiscord(string code, string state)
        {
            try
            {
                var postParams = new List<KeyValuePair<string, string>>();
                postParams.Add(new("client_id", _appSettings.DiscordClientId));
                postParams.Add(new("client_secret", _appSettings.DiscordClientSecret));
                postParams.Add(new("grant_type", "authorization_code"));
                postParams.Add(new("code", code));
                postParams.Add(new("redirect_uri", string.Format(_appSettings.ConnectWithDiscordRedirectUrl, "")));
                var getToken = _httpClientFactoryService.PostFormUrlEncoded(string.Format(_appSettings.DiscordTokenUrl), postParams).Result;
                if (getToken != null)
                {
                    var discordApiResponse = _httpClientFactoryService.GetBearerAuthorizeAsync(_appSettings.DiscordApisUrl, getToken["access_token"].ToString()).Result;
                    if (discordApiResponse != null)
                    {

                        var result = await _accountServices.ConnectWithDiscord(Guid.Parse(state), discordApiResponse["id"].ToString(), discordApiResponse["username"].ToString());
                         
                        return Redirect(string.Format(_appSettings.ConnectWithDiscordClientRedirectUrl, "?connectWithDiscord=success"));
                    }
                    else
                    {
                        return Redirect(string.Format(_appSettings.ConnectWithDiscordClientRedirectUrl, "?connectWithDiscord=error"));
                    }
                }
                else
                {
                    return Redirect(string.Format(_appSettings.ConnectWithDiscordClientRedirectUrl, "?connectWithDiscord=error"));
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return Redirect(string.Format(_appSettings.ConnectWithDiscordClientRedirectUrl, "?connectWithDiscord=error"));
            } 

            
        }

        [AllowAnonymous]
        [HttpGet("AuthorizeWithDiscord")]
        public async Task<RedirectResult> AuthorizeWithDiscord(string code)
        {
            try
            { 
                var postParams = new List<KeyValuePair<string, string>>(); 
                postParams.Add(new("client_id", _appSettings.DiscordClientId));
                postParams.Add(new("client_secret", _appSettings.DiscordClientSecret));
                postParams.Add(new("grant_type", "authorization_code"));
                postParams.Add(new("code", code));
                postParams.Add(new("redirect_uri", _appSettings.DiscordAuthenticationRedirectUrl)); 
                var getToken = _httpClientFactoryService.PostFormUrlEncoded(string.Format(_appSettings.DiscordTokenUrl), postParams).Result;
                if (getToken != null)
                { 
                    var discordApiResponse = _httpClientFactoryService.GetBearerAuthorizeAsync(_appSettings.DiscordApisUrl, getToken["access_token"].ToString()).Result;
                    if (discordApiResponse != null)
                    {
                        var result = await _accountServices.RegisterWithDiscord(
                            discordApiResponse["id"].ToString(),
                             discordApiResponse["username"].ToString(),
                            discordApiResponse["username"].ToString(),
                            discordApiResponse["email"].ToString(),
                            string.Empty,
                            discordApiResponse["global_name"].ToString(),
                           string.Format( _appSettings.DiscordCDNUrl, "avatars", discordApiResponse["id"].ToString() + "/", discordApiResponse["avatar"].ToString() + ".png")
                            ); 
                        return Redirect(string.Format(_appSettings.DiscordAuthenticationRedirectRegiterUrl, "success"));
                    }
                    else
                    { 
                        return Redirect(string.Format(_appSettings.DiscordAuthenticationRedirectRegiterUrl, "error"));
                    }
                }
                else
                {
                    return Redirect(string.Format(_appSettings.DiscordAuthenticationRedirectRegiterUrl, "error"));
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return Redirect(string.Format(_appSettings.DiscordAuthenticationRedirectRegiterUrl, "error")); 
            }
        }


        [AllowAnonymous]
        [HttpGet("RegisterWithGoogle")]
        public async Task<BaseResponse<ResultCode>> RegisterWithGoogle(string access_token)
        {  
            try
            {
               var googleApiResponse = _httpClientFactoryService.GetAsync(string.Format(_appSettings.GoogleApisUrl, access_token)).Result;
               if(googleApiResponse != null)
                {
                    var result = await _accountServices.Register(
                        googleApiResponse["email"].ToString(), 
                        googleApiResponse["email"].ToString(), 
                        string.Empty,
                        googleApiResponse["name"].ToString(),
                        googleApiResponse["picture"].ToString()
                        );
                    return new BaseResponse<ResultCode>(string.Empty, result); 
                }
                else
                {
                    return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Unknown);
                } 
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Error);
            }
        }

        [AllowAnonymous]
        [HttpGet("RegisterWithFacebook")]
        public async Task<BaseResponse<ResultCode>> RegisterWithFacebook(string userId, string access_token)
        {
            try
            {
                var googleApiResponse = _httpClientFactoryService.GetAsync(string.Format(_appSettings.FacebookApisUrl, userId, access_token)).Result;
                if (googleApiResponse != null)
                {
                    var result = await _accountServices.Register(
                        googleApiResponse["email"].ToString(),
                        googleApiResponse["email"].ToString(),
                        string.Empty,
                        googleApiResponse["name"].ToString(),
                        googleApiResponse["picture"].ToString()
                        );
                    return new BaseResponse<ResultCode>(string.Empty, result);
                }
                else
                {
                    return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Unknown);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Error);
            }
        }

        [AllowAnonymous]
        [HttpGet("CheckEmail")]
        public async Task<BaseResponse<ResultCode>> CheckEmail(string email)
        { 
            var result = await _accountServices.CheckEmail(email);
            return new BaseResponse<ResultCode>(string.Empty, result); 
        }

        [AllowAnonymous]
        [HttpGet("CheckEmailWithUser")]
        public async Task<BaseResponse<ResultCode>> CheckEmailWithUser(string email, Guid Id)
        {
            var result = await _accountServices.CheckEmailWithUser(email, Id);
            return new BaseResponse<ResultCode>(string.Empty, result);
        }

        [AllowAnonymous]
        [HttpGet("CheckUserName")]
        public async Task<BaseResponse<ResultCode>> CheckUserName(string name)
        {
            var result = await _accountServices.CheckUserName(name);
            return new BaseResponse<ResultCode>(string.Empty, result);
        }

        [AllowAnonymous]
        [HttpPost("ForgotPassword")]
        public async Task<BaseResponse<ResultCode>> ForgotPassword([FromBody] BaseRequest<ForgotPasswordRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.ForgotPassword(request.Payload.Email);
                return new BaseResponse<ResultCode>(string.Empty, result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }
        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        public async Task<BaseResponse<ResultCode>> ResetPassword([FromBody] BaseRequest<ResetPasswordRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.ResetPassword(request.Payload.UserInfo, request.Payload.NewPassword);
                return new BaseResponse<ResultCode>(string.Empty, result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }
         
        [HttpPost("ChangePassword")]
        public async Task<BaseResponse<ResultCode>> ChangePassword([FromBody] BaseRequest<ResetPasswordRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.ChangePassword(request.Payload.UserInfo, request.Payload.NewPassword);
                return new BaseResponse<ResultCode>(string.Empty, result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }



        [HttpPost("UpdateProfile")]
        public async Task<BaseResponse<ResultCode>> UpdateProfile([FromBody] BaseRequest<UpdateProfileRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.UpdateProfile(GetCurrentUserId(), request);
                return new BaseResponse<ResultCode>(string.Empty, result); 
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }
        
        [HttpPost("UpdateUserAvatar")]
        public async Task<BaseResponse<ResultCode>> UpdateUserAvatar([FromBody] BaseRequest<UpdateUserAvatarRequest> request)
        {
            if (ModelState.IsValid)
            {
                var result = await _accountServices.UpdateUserAvatar(GetCurrentUserId(), request);
                return new BaseResponse<ResultCode>(result);
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        }
         
         
        [HttpPost("SendFeedback")]
        public async Task<BaseResponse<ResultCode>> SendFeedback([FromBody] BaseRequest<FeedbackRequest> request)
        {
            if (ModelState.IsValid)
            {
                return new BaseResponse<ResultCode>(await _accountServices.SendFeedback(request, GetCurrentUserId()));
            }
            else
            {
                return new BaseResponse<ResultCode>(Constants.InvalidMsg, ResultCode.Invalid);
            }
        } 
    }
}
