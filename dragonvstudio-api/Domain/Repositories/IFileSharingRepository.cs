using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Repositories
{
    public interface IFileSharingRepository
    {
        Task<(FileSharing, ResultCode)> AddUpdateFileSharing(BaseRequest<AddUpdateFileSharingRequest> request, Guid userId);
        Task<(List<FileSharing>, ResultCode)> GetFileSharing(BaseRequest<FileSharingSearchRequest> request);
        Task<ResultCode> RemoveFileSharing(BaseRequest<RequestId> request, Guid userId);
        Task<(List<FileSharing>, ResultCode)> GetAdminFileSharing(BaseRequest<FileSharingSearchRequest> request, Guid userId);
    }
}
