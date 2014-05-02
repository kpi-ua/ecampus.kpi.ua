using System.Linq;
using Campus.SDK;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Script.Serialization;

namespace Core
{
    public class CampusClient : Campus.SDK.Client
    {
        private T Get<T>(string controller, string method, object arguments = null)
            where T : class
        {
            var url = arguments == null ? BuildUrl(controller, method) : BuildUrl(controller, method, arguments);
            var result = Get(url);

            if (result.Data == null)
            {
                return null;
            }

            var model = JsonConvert.DeserializeObject<T>(result.Data.ToString());
            return model;
        }

        private WebClient _client;

        public Dictionary<String, object> GetData(string url)
        {
            try
            {
                //TODO: Replace by this:
                //var client = new Campus.SDK.Client();
                //var result = client.Get(request);

                var json = DownloadString(url);
                var serializer = new JavaScriptSerializer();
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                return respDictionary;
            }
            catch (Exception ex)
            {
                var logger = LogManager.GetCurrentClassLogger();
                logger.ErrorException("Helper:GetData", ex);
                return null;
            }
        }

        public string DownloadString(string url)
        {
            var text = Cache.Get(url, HttpMethod.Get, null);

            if (String.IsNullOrEmpty(text))
            {
                var client = CreateWebClient();
                text = client.DownloadString(url);
                Cache.Set(url, HttpMethod.Get, null, text);
            }

            return text;
        }

        private WebClient CreateWebClient()
        {
            if (_client == null)
            {
                _client = new WebClient
                {
                    Encoding = System.Text.Encoding.UTF8
                };

                if (Campus.SDK.Client.Proxy != null)
                {
                    _client.Proxy = Campus.SDK.Client.Proxy;
                }
            }

            return _client;
        }

        public Result GetUserConversation(string sessionId, int groupId, int size)
        {
            var url = BuildUrl("Message", "GetUserConversation", new
            {
                sessionId,
                groupId,
                size
            });

            var result = Get(url);

            return result;
        }

        public IEnumerable<Campus.Common.Conversation> GetUserConversations(string sessionId)
        {
            var result = Get<IEnumerable<Campus.Common.Conversation>>("Message", "GetUserConversations", new { sessionId, });
            result = result.OrderByDescending(o => o.LastMessageDate);
            return result;
        }
    }
}