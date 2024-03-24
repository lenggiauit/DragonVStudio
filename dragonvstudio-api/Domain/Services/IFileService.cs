using Microsoft.AspNetCore.Http;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Domain.Services.Communication.Request.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IFileService
    {
        Task<string> UploadImage(IFormFile file, string path);
        Task<string> UploadTemplateZipFile(IFormFile file, string path); 
        Task<(FileSharing, ResultCode)> AddUpdateFileSharing(BaseRequest<AddUpdateFileSharingRequest> request, Guid userId);
        Task<(List<FileSharing>, ResultCode)> GetFileSharing(BaseRequest<FileSharingSearchRequest> request);
        Task<(List<FileSharing>, ResultCode)> GetAdminFileSharing(BaseRequest<FileSharingSearchRequest> request, Guid userId);
        Task<ResultCode> RemoveFileSharing(BaseRequest<RequestId> request, Guid userId);
    }
}
