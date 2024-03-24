using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Helpers
{
    public static class PermissionConstant
    { 
        // permissions
        public const string CreateEditCategory = "CreateEditCategory";
        public const string CreateEditBlogPost = "CreateEditBlogPost";
        public const string ManageUser = "ManageUser";
        public const string ManageFileSharing = "ManageFileSharing";
        public const string GetPrivateTalkList = "GetPrivateTalkList";
        public const string UpdatePrivateTalkStatus = "UpdatePrivateTalkStatus";
        public const string RemovePrivateTalk = "RemovePrivateTalk";

        public const string GetMockInterviewList = "GetMockInterviewList";
        public const string UpdateMockInterviewStatus = "UpdateMockInterviewStatus";
        public const string RemoveMockInterview = "RemoveMockInterview";

    }
}
