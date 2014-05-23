using Campus.SDK;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Script.Serialization;

namespace Core
{
    public class CampusClient : Campus.SDK.Client
    {
        private readonly JavaScriptSerializer _serializer = new JavaScriptSerializer();
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

        private Dictionary<string, object> GetStringObject(string url)
        {
            try
            {
                var json = DownloadString(url);
                var respDictionary = _serializer.Deserialize<Dictionary<string, object>>(json);
                var data = (Dictionary<string, Object>)respDictionary["Data"];
                return data;
            }
            catch
            {
                return new Dictionary<string, object>();
            }
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

        public Campus.Common.User GetUser(string sessionId)
        {
            var result = Get<Campus.Common.User>("User", "GetCurrentUser", new { sessionId, });
            return result;
        }

        public IEnumerable<Campus.Common.BulletinBoard> GetBulletinBoard(string sessionId)
        {
            var result = Get<IEnumerable<Campus.Common.BulletinBoard>>("BulletinBoard", "GetActual", new { sessionId, });
            return result;
        }

        public Dictionary<string, Object> GetIrPurpose()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetIrPurpose");
        }

        public Dictionary<string, object> GetIrForm()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetIrForm");
        }

        public Dictionary<string, object> GetPublicationForm()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetPublicationForm");
        }

        public Dictionary<string, object> GetContributionType()
        {
            return GetStringObject(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributionType");
        }

        public Dictionary<string, object> GetStamp()
        {

            return GetStringObject(ApiEndpoint + "Ir/GetStamp");
        }

        public Dictionary<string, object> GetCountries()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetCountries");
        }

        public Dictionary<string, object> GetLang()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetLang");
        }

        public Dictionary<string, object> GetISType()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetISType");
        }

        public Dictionary<string, object> GetPersonStatusType()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetPersonStatusType");
        }
    }
}