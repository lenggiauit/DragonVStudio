using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http.Headers;
using MimeKit;

namespace DragonVStudio.API.Services
{
    public class HttpClientFactoryService : IHttpClientFactoryService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly AppSettings _apiDataSettings;
        private readonly ILogger<HttpClientFactoryService> _logger;
        public HttpClientFactoryService(IHttpClientFactory clientFactory, ILogger<HttpClientFactoryService> logger, IOptions<AppSettings> apiDataSettings)
        {
            _clientFactory = clientFactory;
            _apiDataSettings = apiDataSettings.Value;
            _logger = logger;
        }


        public async Task<JObject> PostFormUrlEncoded(string url, List<KeyValuePair<string, string>> postData)
        {
            var client = _clientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(15);
            var request = new HttpRequestMessage(HttpMethod.Post, url);
            var content = new FormUrlEncodedContent(postData);
            request.Content = content;
            var response = await client.SendAsync(request);
              
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    using (Stream stream = await response.Content.ReadAsStreamAsync())
                    using (StreamReader streamReader = new StreamReader(stream))
                    using (JsonReader reader = new JsonTextReader(streamReader))
                    {
                        reader.SupportMultipleContent = true;
                        return new JsonSerializer().Deserialize<JObject>(reader);
                    }
                }
                catch (NotSupportedException)
                {
                    _logger.LogError("The content type is not supported.");
                }
                catch (JsonException ex)
                {
                    _logger.LogError("Invalid JSON. Ex: " + ex.Message);
                }
                return null;
            }
            else
            {
                return null;
            }

        }

        public async Task<JObject> PostAsync(string url, Dictionary<string, string> postParams = null)
        {
            var client = _clientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(15);

            var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(url), 
                Content = new FormUrlEncodedContent(postParams)   

            };

            using var response = await client.PostAsync(url, new FormUrlEncodedContent(postParams)); 
            //(httpRequestMessage, HttpCompletionOption.ResponseHeadersRead);

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    using (Stream stream = await response.Content.ReadAsStreamAsync())
                    using (StreamReader streamReader = new StreamReader(stream))
                    using (JsonReader reader = new JsonTextReader(streamReader))
                    {
                        reader.SupportMultipleContent = true;
                        return new JsonSerializer().Deserialize<JObject>(reader);
                    }
                }
                catch (NotSupportedException)
                {
                    _logger.LogError("The content type is not supported.");
                }
                catch (JsonException ex)
                {
                    _logger.LogError("Invalid JSON. Ex: " + ex.Message);
                }
                return null;
            }
            else
            {
                return null;
            }
        }

        public async Task<JObject> GetAsync(string url)
        {
            var client = _clientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(15);
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (response.IsSuccessStatusCode)
            {
                try
                { 
                    using (Stream stream = await response.Content.ReadAsStreamAsync()) 
                    using (StreamReader streamReader = new StreamReader(stream))
                    using (JsonReader reader = new JsonTextReader(streamReader))
                    {
                        reader.SupportMultipleContent = true;
                        return new JsonSerializer().Deserialize<JObject>(reader);
                    }
                }
                catch (NotSupportedException)
                {
                    _logger.LogError("The content type is not supported.");
                }
                catch (JsonException ex)
                {
                    _logger.LogError("Invalid JSON. Ex: " + ex.Message);
                }
                return null;
            }
            else
            {
                return null;
            }
        }

        public async Task<JObject> GetBearerAuthorizeAsync(string url, string access_token)
        {
            var client = _clientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(15);
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", string.Format("Bearer {0}", access_token));
            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    using (Stream stream = await response.Content.ReadAsStreamAsync())
                    using (StreamReader streamReader = new StreamReader(stream))
                    using (JsonReader reader = new JsonTextReader(streamReader))
                    {
                        reader.SupportMultipleContent = true;
                        return new JsonSerializer().Deserialize<JObject>(reader);
                    }
                }
                catch (NotSupportedException)
                {
                    _logger.LogError("The content type is not supported.");
                }
                catch (JsonException ex)
                {
                    _logger.LogError("Invalid JSON. Ex: " + ex.Message);
                }
                return null;
            }
            else
            {
                return null;
            }
        }
    }
}
