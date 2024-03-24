using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Helpers
{
    public enum ResultCode
    {
        Invalid = -2,
        Unknown = -1,
        UnAuthorized = 0, 
        Success = 1,
        Valid = 11,
        Error = 2,
        RegisterExistEmail = 3,
        RegisterExistUserName = 4,
        NotExistUser = 5,
        NotExistEmail = 51,
        Expired = 6,
        DoNotPermission = 7,
        BookingDateIsInvalid = 8,

    }
     
    public enum CacheKeys
    {
        [Description("YoutubeVideos")]
        YoutubeVideos
    }

    
    public enum GameServerStatus
    {
        [Description("Coming Soon")]
        ComingSoon,
        [Description("Available")]
        Available,
        [Description("Pending")]
        Pending,
        [Description("Not Available")]
        NotAvailable
    }



}
