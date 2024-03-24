using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IHomeService
    {
        Task<(List<YoutubeVideo>, ResultCode)> GetYoutubeVideos();
    }
}
