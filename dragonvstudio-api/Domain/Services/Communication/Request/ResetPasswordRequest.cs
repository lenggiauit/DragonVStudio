using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class ResetPasswordRequest
    {
        [Required]
        public string UserInfo { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
