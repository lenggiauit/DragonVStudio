using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using DragonVStudio.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class FileSharingRepository : BaseRepository, IFileSharingRepository
       
    {
        private readonly ILogger<FileSharingRepository> _logger;
        public FileSharingRepository(DragonVContext context, ILogger<FileSharingRepository> logger) : base(context)
        {
            _logger = logger;
        } 
   
        public async Task<(FileSharing, ResultCode)> AddUpdateFileSharing(BaseRequest<AddUpdateFileSharingRequest> request, Guid userId)
        {
            try
            {
                if(request.Payload.Id  != Guid.Empty)
                {
                    var existFileSharing = await _context.FileSharing
                    .Where(f => f.Id == request.Payload.Id).FirstOrDefaultAsync();

                    if (existFileSharing != null)
                    {
                        existFileSharing.Name = request.Payload.Name;
                        existFileSharing.Category = request.Payload.Category;
                        existFileSharing.IsArchived = request.Payload.IsArchived;
                        existFileSharing.Url = request.Payload.Url;
                        existFileSharing.UpdatedBy = userId;
                        existFileSharing.UpdatedDate = DateTime.Now;

                        _context.FileSharing.Update(existFileSharing);
                        await _context.SaveChangesAsync();
                        return (existFileSharing, ResultCode.Success);
                    }
                    else
                    {
                        return (null, ResultCode.Error);
                    }
                } 
                else
                {
                    FileSharing newFileSharing = new FileSharing()
                    {
                        Id = Guid.NewGuid(),
                        Name = request.Payload.Name,
                        Category = request.Payload.Category,
                        Url = request.Payload.Url,
                        IsArchived = request.Payload.IsArchived, 
                        CreatedDate = DateTime.Now,
                        CreatedBy = userId, 
                    };
                    await _context.FileSharing.AddAsync(newFileSharing);
                    await _context.SaveChangesAsync();
                    return (newFileSharing, ResultCode.Success);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AddUpdateFileSharing method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<FileSharing>, ResultCode)> GetFileSharing(BaseRequest<FileSharingSearchRequest> request)
        {
            try
            {
                var query = _context.FileSharing.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(f => f.Category.Contains(request.Payload.Keywords) 
                    || f.Name.Contains(request.Payload.Keywords) 
                    );
                }

                var totalRow = await query.Where(f => !f.IsArchived).CountAsync();

                return (await query 
                    .AsNoTracking()
                    .Where(f => !f.IsArchived)
                    .Select(f => new FileSharing()
                    {
                        Id = f.Id,
                        Category = f.Category,
                        Name = f.Name, 
                        Url = f.Url, 
                        TotalRows = totalRow,
                        CreatedDate = f.CreatedDate,
                        UpdatedDate = f.UpdatedDate,
                    })
                    .OrderBy(f => f.CreatedDate)
                    .OrderBy(f => f.UpdatedDate)
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetFileSharing method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<FileSharing>, ResultCode)> GetAdminFileSharing(BaseRequest<FileSharingSearchRequest> request, Guid userId)
        {
            try
            {
                var query = _context.FileSharing.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(f => f.Category.Contains(request.Payload.Keywords)
                    || f.Name.Contains(request.Payload.Keywords)
                    
                    );
                }

                var totalRow = await query.CountAsync();

                return (await query
                    .AsNoTracking() 
                    .Select(f => new FileSharing()
                    {
                        Id = f.Id,
                        Name = f.Name,
                        Category = f.Category, 
                        Url = f.Url,
                        IsArchived = f.IsArchived,
                        TotalRows = totalRow,
                        CreatedDate = f.CreatedDate,
                        UpdatedDate = f.UpdatedDate,
                    })
                    .OrderBy(p => p.CreatedDate)
                    .OrderBy(p => p.UpdatedDate)
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetAdminFileSharing method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<ResultCode> RemoveFileSharing(BaseRequest<RequestId> request, Guid userId)
        {
            try
            {
                var fileSharing = await _context.FileSharing.Where(f => f.Id.Equals(request.Payload.Id)).FirstOrDefaultAsync();
                if (fileSharing != null)
                {
                    fileSharing.IsArchived = true;
                    fileSharing.UpdatedBy = userId;
                    fileSharing.UpdatedDate = DateTime.Now;
                    _context.Update(fileSharing); 

                }
                return ResultCode.Success;

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at RemoveFileSharing method: " + ex.Message);
                return ResultCode.Error;
            }
        }
    }
}
