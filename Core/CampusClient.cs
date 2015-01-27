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
            var result = Get<User>("User", "GetCurrentUser", new { sessionId, });
            return result;
        }

        public IEnumerable<BulletinBoard> GetBulletinBoard(string sessionId)
        {
            var result = Get<IEnumerable<BulletinBoard>>("BulletinBoard", "GetActual", new { sessionId, });
            return result;
        }

        public Dictionary<string, object> GetIrPurpose()
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

        public Dictionary<string, object> GetKind(string id)
        {
            return GetStringObject(ApiEndpoint + "Ir/GetIrKind?featureId=" + id);
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

        public bool ChangePassword(string sessionId, string oldPassword, string newPassword)
        {
            var url = BuildUrl("User", "ChangePassword", new { sessionId, old = oldPassword, password = newPassword });
            var answer = GetData(url);
            return answer == null;
        }

        public IEnumerable<Permission> GetPermissions(string sessionId)
        {
            var answer = GetData(ApiEndpoint + "User/GetEffectivePermissions?sessionId=" + sessionId);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="postData"></param>
        /// <returns></returns>
        public string Request(string url, string method, string postData)
        {
            string responseData = "";

            try
            {
                var request = (System.Net.HttpWebRequest)WebRequest.Create(url);
                request.Accept = "*/*";
                request.AllowAutoRedirect = true;
                request.UserAgent = "http_requester/0.1";
                request.Timeout = 60000;
                request.Method = method;

                if (request.Method == "POST")
                {
                    request.ContentType = "application/x-www-form-urlencoded";
                    // Use UTF8Encoding instead of ASCIIEncoding for XML requests:
                    var encoding = new System.Text.ASCIIEncoding();
                    var postByteArray = encoding.GetBytes(postData);
                    request.ContentLength = postByteArray.Length;

                    var postStream = request.GetRequestStream();
                    postStream.Write(postByteArray, 0, postByteArray.Length);
                    postStream.Close();
                }

                var response = (System.Net.HttpWebResponse)request.GetResponse();

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    var responseStream = response.GetResponseStream();
                    var myStreamReader =
                        new System.IO.StreamReader(responseStream);
                    responseData = myStreamReader.ReadToEnd();
                }

                response.Close();
            }
            catch (Exception e)
            {
                responseData = "An error occurred: " + e.Message;
            }

            return responseData;
        }

        public T MakeRequest<T>(string url)
        {
            var request = WebRequest.Create(url) as HttpWebRequest;

            using (var response = request.GetResponse() as HttpWebResponse)
            {
                var reader = new StreamReader(response.GetResponseStream());
                return JsonConvert.DeserializeObject<T>(ClearResponse(reader.ReadToEnd()));
            }
        }

        private static string ClearResponse(string resp)
        {
            var r = resp.Split(new[] { "\"Data\":" }, StringSplitOptions.RemoveEmptyEntries);
            r[1] = r[1].Substring(0, r[1].Length - 1);
            return r[1];
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

        public IEnumerable<Group> DeskGetGroupTypesList(int subdivisionId)
        {
            return Get<IEnumerable<Group>>("BulletinBoard", "DeskGetGroupTypesList", new { subdivisionId });
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

        public string DeskIsModerator(string sessionId)
        {
            return Get<string>("BulletinBoard", "DeskIsModerator", new { sessionId });
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
        public List<Campus.Common.TimeTable> GeTimeTables(string sessionId, string profile)
        {
            var url = BuildUrl("TimeTable", "GetTimeTable", new { sessionId, profile });
            var result = Get<List<TimeTable>>("TimeTable", "GetTimeTable", new { sessionId, profile });
            return result;
        }

        public List<Campus.Common.Contributor> GetPersonName(string sessionId, string name)
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

        public List<Campus.Common.Division> GetSubdivisions(string sessionId, int subsystemId)
        {
            var result = Get<List<Campus.Common.Division>>("Responsible", "GetSubDivisions", new { sessionId, subsystemId });
            return result;
        }

        public List<Campus.Common.OKR> GetOKR()
        {
            var result = Get<List<Campus.Common.OKR>>("Specialist", "GetDcOkr", new { });
            return result;
        }

        public List<Campus.Common.RtProfTrainTotal> GetSpecialities(int subdivId, int dcOkrId)
        {
            var result = Get<List<Campus.Common.RtProfTrainTotal>>("Specialist", "GetSpecByOkr", new { subdivId, dcOkrId });
            return result;
        }

        public List<Campus.Common.RtDiscipline> GetRtDiscipline(string sessionId, int rtProfTrainTotalId)
        {
            var result = Get<List<Campus.Common.RtDiscipline>>("Specialist", "GetRtProfTrainTotal", new { sessionId, rtProfTrainTotalId });
            return result;
        }

        public List<ContactType> GetAllContactTypes()
        {
            try
            {
                var result = Get<List<ContactType>>("User", "GetAllContactType");
                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public bool AddUserContact(string sessionId, string userContactTypeName, string userContactValue, string isVisible, string receptioHours)
        {
            var url = BuildUrl("User", "AddUserContact", new { sessionId, userContactTypeName, userContactValue, isVisible, receptioHours });
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
        public int AddUserContactRetContactId(string sessionId, string userContactTypeName, string userContactValue, string isVisible, string receptioHours)
        {
            var url = BuildUrl("User", "AddUserContactReturnContactId", new { sessionId, userContactTypeName, userContactValue, isVisible, receptioHours });
            var answer = GetData(url);
            if (Int32.Parse(answer["Data"].ToString().Split(':')[0]) > 0)
            {
                return Int32.Parse(answer["Data"].ToString().Split(':')[0]);
            }
            else
            {
                return -1;
            }
        }
        public bool SetUserCredo(string sessionId, string userCredo)
        {
            var url = BuildUrl("User", "SetUserCredo", new { sessionId, userCredo });
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

        public string GetUserCredo(string sessionId)
        {
            var url = BuildUrl("User", "GetUserCredo", new { sessionId });
            var answer = GetData(url);
            if (answer["Data"] == null) return null;
            return answer["Data"].ToString();
        }


        /*
          public List<Campus.Common.RtDiscipline> GetRtDiscipline(string sessionId, int rtProfTrainTotalId)
        {
            var result = Get<List<Campus.Common.RtDiscipline>>("Specialist", "GetRtProfTrainTotal", new { sessionId, rtProfTrainTotalId });
            return result;
        }
         */
        public List<Campus.Common.DcDiscipline> GetDcDisciplines(string sessionId, string name)
        {
            var result = Get<List<Campus.Common.DcDiscipline>>("Discipline", "GetDcDisciplineName",
                new { sessionId, name });
            return result;
        }

        public IList<Campus.Common.Irs> GetAllIrs(string sessionId, int pageNumber, int pageSize, out IPagedList paging)
        {

            var url = BuildUrl("Ir", "GetAllIrs", new
            {
                sessionId,
                pageNumber,
                pageSize
            });

            var result = Get(url);

            paging = result.Paging;
            IEnumerable<Campus.Common.Irs> messages = JsonConvert.DeserializeObject<IEnumerable<Campus.Common.Irs>>(result.Data.ToString());


            return messages.ToList();

        }

        public IList<Campus.Common.Irs> GetIrResourses(string sessionId, string author, string type, string irview, int pageNumber, int pageSize, out IPagedList paging)
        {

            var url = BuildUrl("Ir", "GetIrResourses", new
            {
                sessionId,
                author,
                type,
                irview,
                pageNumber,
                pageSize

            });

            var result = Get(url);

            paging = result.Paging;
            IEnumerable<Campus.Common.Irs> messages = JsonConvert.DeserializeObject<IEnumerable<Campus.Common.Irs>>(result.Data.ToString());


            return messages.ToList();

        }

        public IList<Campus.Common.Irs> GetIrbyDcDisc(string sessionId, string dsc, int pageNumber, int pageSize, out IPagedList paging)
        {

            var url = BuildUrl("Ir", "GetIrbyDcDisc", new
            {
                sessionId,
                dsc,
                pageNumber,
                pageSize
            });

            var result = Get(url);

            paging = result.Paging;
            IEnumerable<Campus.Common.Irs> messages = JsonConvert.DeserializeObject<IEnumerable<Campus.Common.Irs>>(result.Data.ToString());

            return messages.ToList();
        }

        public IList<Campus.Common.Irs> GetIrbyCredMod(string sessionId, string dsc, int pageNumber, int pageSize, out IPagedList paging)
        {

            var url = BuildUrl("Ir", "GetIrbyCredMod", new
            {
                sessionId,
                dsc,
                pageNumber,
                pageSize
            });

            var result = Get(url);

            paging = result.Paging;
            IEnumerable<Campus.Common.Irs> messages = JsonConvert.DeserializeObject<IEnumerable<Campus.Common.Irs>>(result.Data.ToString());

            return messages.ToList();
        }
    }
}