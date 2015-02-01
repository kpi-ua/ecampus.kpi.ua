using Campus.Common;
using Campus.SDK;
using Newtonsoft.Json;
using NLog;
using PagedList;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Script.Serialization;

namespace Core
{
    public class CampusClient : Client
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

            if (result.Data.ToString() == "True" || result.Data.ToString() == "False")
                return result.Data.ToString();
            return JsonConvert.DeserializeObject<T>(result.Data.ToString());
        }

        private Dictionary<string, object> GetStringObject(string url)
        {
            try
            {
                var json = DownloadString(url);
                var respDictionary = _serializer.Deserialize<Dictionary<string, object>>(json);
                var data = (Dictionary<string, object>)respDictionary["Data"];
                return data;
            }
            catch
            {
                return new Dictionary<string, object>();
            }
        }

        private WebClient _client;

        private WebClient CreateWebClient()
        {
            if (_client == null)
            {
                _client = new WebClient
                {
                    Encoding = Encoding.UTF8
                };

                if (Proxy != null)
                {
                    _client.Proxy = Proxy;
                }
            }

            return _client;
        }

        public Dictionary<string, object> GetData(string url)
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
                logger.Error("Helper:GetData", ex);
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

        public IList<Message> GetUserConversation(string sessionId, int groupId, int size, out IPagedList paging)
        {
            var url = BuildUrl("Message", "GetUserConversation", new
            {
                sessionId,
                groupId,
                size
            });

            var result = Get(url);
            paging = result.Paging;

            IEnumerable<Message> messages = JsonConvert.DeserializeObject<IEnumerable<Message>>(result.Data.ToString());
            return messages.ToList();
        }

        public IEnumerable<Conversation> GetUserConversations(string sessionId)
        {
            var result = Get<IEnumerable<Conversation>>("Message", "GetUserConversations", new { sessionId, });
            result = result.OrderByDescending(o => o.LastMessageDate);
            return result;
        }

        public User GetUser(string sessionId)
        {
            if (String.IsNullOrEmpty(sessionId))
            {
                return null;
            }

            var result = Get<User>("User", "GetCurrentUser", new { sessionId, });
            return result;
        }

        public Dictionary<string, object> GetContributorType()
        {
            return GetStringObject(ApiEndpoint + "Ir/GetContributorType");
        }

        public bool ChangePassword(string sessionId, string oldPassword, string newPassword)
        {
            var url = BuildUrl("User", "ChangePassword", new { sessionId, old = oldPassword, password = newPassword });
            var answer = GetData(url);
            return answer == null;
        }

        public IEnumerable<Bulletin> DeskGetActualBulletins(int userId)
        {
            var l = Get<IEnumerable<Bulletin>>("BulletinBoard", "DeskGetActualBulletins", new { userId });
            foreach (var v in l)
            {
                v.LinkList = new List<BulletinLink>();
                v.ParseLink(v.StrLinkList);
            }
            return l;
        }

        public IEnumerable<SimpleInfo> DeskGetAllowedProfiles()
        {
            return Get<IEnumerable<SimpleInfo>>("BulletinBoard", "DeskGetProfileTypesList");
        }

        public IEnumerable<SimpleInfo> DeskGetFacultyTypesList()
        {
            return Get<IEnumerable<SimpleInfo>>("BulletinBoard", "DeskGetFacultyTypesList");
        }

        public string DeskAddBulletein(int creatorId,
            string creatorName,
            string creationDate,
            string startDate,
            string endDate,
            string subject,
            string text,
            string link = "///")
        {
            return Get<string>("BulletinBoard", "DeskAddBulletin", new
            {
                creatorId,
                creatorName,
                creationDate,
                startDate,
                endDate,
                subject,
                text,
                link
            });
        }

        public string DeskUpdateBulletein(int creatorId,
            string creatorName,
            string subject,
            string text,
            int id,
            string link = "///"
            )
        {
            return Get<string>("BulletinBoard", "DeskUpdateBulletin", new
            {
                creatorId,
                creatorName,
                subject,
                text,
                id,
                link
            });
        }

        public void DeskRemoveBulletin(int id)
        {
            Get<string>("BulletinBoard", "DeskRemoveBulletin", new { id = id });
        }

        public bool IsConfirmSet(string sessionId)
        {
            var url = BuildUrl("User", "IsConfirmed", new { sessionId });
            var answer = GetData(url);
            if (answer["Data"].ToString().Split(':')[0] == "OK")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool SetReasonFailure(string sessionId, string reasonFailure)
        {
            var url = BuildUrl("User", "SetReasonFailure", new { sessionId, reasonFailure });
            var answer = GetData(url);
            if (answer["Data"].ToString().Split(':')[0] == "OK")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public List<TimeTable> GeTimeTables(string sessionId, string profile)
        {
            var url = BuildUrl("TimeTable", "GetTimeTable", new { sessionId, profile });
            var result = Get<List<TimeTable>>("TimeTable", "GetTimeTable", new { sessionId, profile });
            return result;
        }

        public List<Contributor> GetPersonName(string sessionId, string name)
        {

            try
            {
                var url = Campus.SDK.Client.BuildUrl("Ir", "GetPersonName", new { sessionId, name });
                var result = Get<List<Campus.Common.Contributor>>("Ir", "GetPersonName", new { sessionId, name });
                return result;
            }
            catch { return null; }
        }

        public ArrayList GetIrKinds()
        {
            try
            {
                var url = Campus.SDK.Client.BuildUrl("Ir", "GetIrKinds");
                var result = Get<ArrayList>("Ir", "GetIrKinds");
                return result;
            }
            catch { return null; }
        }

        public IEnumerable<Division> GetSubdivisions(string sessionId, int subsystemId)
        {
            var result = Get<List<Campus.Common.Division>>("Responsible", "GetSubDivisions", new { sessionId, subsystemId });
            return result;
        }

        public IEnumerable<OKR> GetOKR()
        {
            var result = Get<List<Campus.Common.OKR>>("Specialist", "GetDcOkr", new { });
            return result;
        }

        public IEnumerable<RtProfTrainTotal> GetSpecialities(int subdivId, int dcOkrId)
        {
            var result = Get<List<RtProfTrainTotal>>("Specialist", "GetSpecByOkr", new { subdivId, dcOkrId });
            return result;
        }

        public IEnumerable<RtDiscipline> GetRtDiscipline(string sessionId, int rtProfTrainTotalId)
        {
            var result = Get<List<Campus.Common.RtDiscipline>>("Specialist", "GetRtProfTrainTotal", new { sessionId, rtProfTrainTotalId });
            return result;
        }

        public IEnumerable<String> GetAllContactTypes()
        {
            try
            {
                var result = Get<List<String>>("User", "GetAllContactTypes");
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public int AddUserContactRetContactId(string sessionId, string userContactTypeName, string userContactValue, string isVisible, string receptioHours)
        {
            var url = BuildUrl("User", "AddUserContactReturnContactId", new { sessionId, userContactTypeName, userContactValue, isVisible, receptioHours });
            var answer = GetData(url);

            if (Int32.Parse(answer["Data"].ToString().Split(':')[0]) > 0)
            {
                return Int32.Parse(answer["Data"].ToString().Split(':')[0]);
            }

            return -1;
        }

        public bool SetUserCredo(string sessionId, string userCredo)
        {
            var url = BuildUrl("User", "SetUserCredo", new { sessionId, userCredo });
            var answer = GetData(url);

            if (answer["Data"].ToString().Split(':')[0] == "OK")
            {
                return true;
            }

            return false;
        }

        public string GetUserCredo(string sessionId)
        {
            var url = BuildUrl("User", "GetUserCredo", new { sessionId });
            var answer = GetData(url);

            if (answer["Data"] == null)
            {
                return null;
            }

            return answer["Data"].ToString();
        }

        public List<DcDiscipline> GetDcDisciplines(string sessionId, string name)
        {
            var result = Get<List<Campus.Common.DcDiscipline>>("Discipline", "GetDcDisciplineName", new { sessionId, name });
            return result;
        }
    }
}