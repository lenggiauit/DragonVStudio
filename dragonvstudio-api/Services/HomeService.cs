using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class HomeService : IHomeService
    {
        private readonly ILogger<HomeService> _logger;
        private readonly IDistributedCache _distributedCache;
        private readonly IHttpClientFactory _clientFactory;
        private readonly AppSettings _appSettings; 

        public HomeService(IDistributedCache distributedCache, IHttpClientFactory clientFactory, ILogger<HomeService> logger, IOptions<AppSettings> appSettings)
        { 
            _logger = logger; 
            _appSettings = appSettings.Value;
            _distributedCache = distributedCache;
            _clientFactory = clientFactory;
        }

        public Task<(List<Feedback>, ResultCode)> GetFeedbackList()
        {
            throw new NotImplementedException();
        }

        public async Task<(List<YoutubeVideo>, ResultCode)> GetYoutubeVideos()
        {
            string jsonString = await _distributedCache.GetStringAsync(CacheKeys.YoutubeVideos.ToString());
            if (!string.IsNullOrEmpty(jsonString))
            {
                List<YoutubeVideo> videos = JsonConvert.DeserializeObject<List<YoutubeVideo>>(jsonString);
                return (videos, ResultCode.Success);
            }
            else
            {
                var options = new DistributedCacheEntryOptions();  
                options.SetSlidingExpiration(TimeSpan.FromHours(2));

                var client = _clientFactory.CreateClient(); 
                var request = new HttpRequestMessage(HttpMethod.Get, string.Format( _appSettings.YoutubeAPIUrl, _appSettings.YoutubeAPIKey, _appSettings.YoutubeChannelId));
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
                            var content = new JsonSerializer().Deserialize<JObject>(reader);
                            if (content != null)
                            {
                                List<YoutubeVideo> videos = new List<YoutubeVideo>();
                                foreach (var item in content["items"])
                                {
                                    YoutubeVideo video = new YoutubeVideo();
                                    video.Id = item["id"]["videoId"].ToString();
                                    video.Title = item["snippet"]["title"].ToString();
                                    video.Description = item["snippet"]["description"].ToString();
                                    video.Thumbnail = item["snippet"]["thumbnails"]["high"]["url"].ToString();
                                    video.Url = String.Format("https://www.youtube.com/watch?v={0}", item["id"]["videoId"].ToString());

                                    videos.Add(video);
                                }
                                await _distributedCache.SetStringAsync(CacheKeys.YoutubeVideos.ToString(), JsonConvert.SerializeObject(videos), options);
                                return (videos, ResultCode.Success);
                            }
                            else
                            {
                                return (null, ResultCode.Error);
                            }
                        }
                    }
                    catch (NotSupportedException ex)
                    {
                        _logger.LogError("The content type is not supported: " + ex.Message);
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError("Invalid JSON: " + ex.Message);
                    }
                    return (null, ResultCode.Error);
                }
                else
                {
                    return (null, ResultCode.Error);
                }
            }
        }
    }
}
