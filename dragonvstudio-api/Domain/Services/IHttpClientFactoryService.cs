using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Domain.Services
{
    public interface IHttpClientFactoryService
    {
        Task<JObject> PostFormUrlEncoded(string url, List<KeyValuePair<string, string>> postData);
        Task<JObject> PostAsync(string url, Dictionary<string, string> postParams);
        Task<JObject> GetAsync(string url);
        Task<JObject> GetBearerAuthorizeAsync(string url, string access_token);
    }
}
