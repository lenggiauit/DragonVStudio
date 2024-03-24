using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface INotificationService
    {
        Task<(int, ResultCode)> GetNotificationCount(Guid userId);
        Task<(List<Notification>, ResultCode)> GetNotification(Guid userId);
        Task<ResultCode> Remove(Guid Id, Guid userId);
        Task<ResultCode> RemoveAll(Guid userId);
    }
}
