using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class NotificationRepository : BaseRepository, INotificationRepository
    {
        private readonly ILogger<NotificationRepository> _logger;
        public NotificationRepository(DragonVContext context, ILogger<NotificationRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<(List<Notification>, ResultCode)> GetNotification(Guid userId)
        {
            try
            {
                return (await _context.Notification
                    .Where(n => n.UserId.Equals(userId))
                    .OrderByDescending(n => n.CreatedDate)
                    .AsNoTracking()
                    .Take(10)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetNotification method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(int, ResultCode)> GetNotificationCount(Guid userId)
        {
            try
            {
                return (await _context.Notification
                    .Where(n => n.UserId.Equals(userId)) 
                    .AsNoTracking() 
                    .CountAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetNotificationCount method: " + ex.Message);
                return (0, ResultCode.Error);
            }
        }

        public async Task<ResultCode> Remove(Guid id, Guid userId)
        {
            try
            {
                var notify = await _context.Notification.Where(n => n.UserId.Equals(userId) && n.Id.Equals(id)).FirstOrDefaultAsync();
                if (notify != null)
                {
                    _context.Notification.Remove(notify);
                    await _context.SaveChangesAsync();
                }
                return ResultCode.Success;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at Remove Notification method: " + ex.Message);
                return ResultCode.Error;
            }
        }

        public async Task<ResultCode> RemoveAll(Guid userId)
        {
            try
            {
                var listNotify = await _context.Notification.Where(n => n.UserId.Equals(userId)).ToListAsync();
                if (listNotify != null && listNotify.Count > 0)
                {
                    _context.Notification.RemoveRange(listNotify);
                    await _context.SaveChangesAsync();
                }
                return ResultCode.Success;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at Remove Notification method: " + ex.Message);
                return ResultCode.Error;
            }
        }

        public async Task<ResultCode> SendNotification(string message, Guid toUserId)
        {
            try
            {

                var newNotify = new Notification()
                {
                    Id = Guid.NewGuid(), 
                    CreatedDate = DateTime.Now,
                    Message = message,
                    UserId = toUserId, 
                };
                await _context.Notification.AddAsync(newNotify);
                await _context.SaveChangesAsync(); 
                return ResultCode.Success;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at SendNotification method: " + ex.Message);
                return ResultCode.Error;
            }
        }
    }
}
