using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static DragonVStudio.API.Domain.Helpers.AccessToken;

namespace DragonVStudio.API.Infrastructure
{
    public class BaseController : Controller
    { 
        [NonAction]
        public Guid GetCurrentUserId()
        {
            var claimUser = HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.UserData).FirstOrDefault();
            if (claimUser != null)
            {
                User user = JsonConvert.DeserializeObject<User>(claimUser.Value);
                return user.Id;
            }
            else
            {
                return Guid.Empty;
            }
        }

        [NonAction]
        public User GetCurrentUser()
        {
            var claimUser = HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.UserData).FirstOrDefault();
            if (claimUser != null)
            {
                User user = JsonConvert.DeserializeObject<User>(claimUser.Value);
                return user;
            }
            else
            {
                return null;
            }
        } 
    }
}
