using System.Collections;
using Campus.SDK;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        public IList<Campus.Common.Message> GetUserConversation(string sessionId, int groupId, int size, out PagedList.IPagedList paging)
        {
            var url = BuildUrl("Message", "GetUserConversation", new
            {
                sessionId,
                groupId,
                size
            });

            var result = Get(url);
            paging = result.Paging;

            IEnumerable<Campus.Common.Message> messages = JsonConvert.DeserializeObject<IEnumerable<Campus.Common.Message>>(result.Data.ToString());
            return messages.ToList();
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

        public Dictionary<string, object> GetContributorType()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetContributorType");
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

        public Dictionary<string, object> GetFeature()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetIrFeature");
        }

        public Dictionary<string, object> GetKind()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetIrKind");
        }

        public Dictionary<string, object> GetCities(string countryId)
        {
            return GetStringObject(ApiEndpoint + "Ir/GetCities?countryId=" + countryId);
        }

        public Dictionary<string, object> GetStampOrg(string cityId)
        {
            return GetStringObject(ApiEndpoint + "Ir/GetStampOrg?cityId=" + cityId);
        }

        public Dictionary<string, object> GetPublishOrg(string cityId)
        {
            return GetStringObject(ApiEndpoint + "Ir/GetPublishOrg?cityId=" + cityId);
        }

        public IEnumerable<JObject> GetAllPrivateIrGroups(string SessionId)
        {
            var url = BuildUrl("IrGroup", "GetAllPrivateIrGroups", new { SessionId });
            var result = Get(url);
            var inner = JsonConvert.DeserializeObject(result.Data.ToString());
            var groups = ((IEnumerable<Object>)inner).Cast<JObject>().ToList();
            return groups;
        }

        public bool ChangePassword(string sessionId, string oldPassword, string newPassword)
        {
            var url = BuildUrl("User", "ChangePassword", new { sessionId, old = oldPassword, password = newPassword });
            var answer = GetData(url);
            return answer == null;
        }

        public IList<Permission> GetPermissions(string sessionId)
        {
            var answer = GetData(Campus.SDK.Client.ApiEndpoint + "User/GetEffectivePermissions?sessionId=" + sessionId);
            var data = (ArrayList)answer["Data"];

            var permissions = new List<Permission>();

            for (var i = 0; i < data.Count; i++)
            {
                Permission permission = null;

                foreach (var p in (Dictionary<string, object>)data[i])
                {
                    var prem = (p.Value.ToString().ToLower() != "false");

                    switch (p.Key)
                    {
                        case "SubsystemName":
                            {
                                permission = new Permission(p.Value.ToString());
                                break;
                            }
                        case "IsCreate":
                            {
                                permission.Create = prem;
                                break;
                            }
                        case "IsRead":
                            {
                                permission.Read = prem;
                                break;
                            }
                        case "IsUpdate":
                            {
                                permission.Update = prem;
                                break;
                            }
                        case "IsDelete":
                            {
                                permission.Delete = prem;
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }

                if (permission != null)
                {
                    permissions.Add(permission);
                }
                else
                {
                    throw (new Exception("Права пользователя не получены!"));
                }
            }

            return permissions;
        }

    }
}