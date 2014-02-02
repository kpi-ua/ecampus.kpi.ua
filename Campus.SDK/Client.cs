using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Campus.SDK
{
    /// <summary>
    /// ecampus client
    /// </summary>
    public class Client
    {
        /// <summary>
        /// 
        /// </summary>
        public static IWebProxy Proxy { get; set; }

        public const string ApiEndpoint = "http://api.ecampus.kpi.ua/";

        private DateTime _authenticatedTime;

        /// <summary>
        /// 
        /// </summary>
        public string SessionId { get; protected set; }

        /// <summary>
        /// by default session has expire time. This property retrn that your session is valid.
        /// </summary>
        public bool SessionIsActual
        {
            get { return _authenticatedTime.AddMinutes(18) > DateTime.Now && !String.IsNullOrEmpty(SessionId); }
        }

        public Client()
        {
            SessionId = String.Empty;
        }

        /// <summary>
        /// Authenticate user in ecampus
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="password">User password</param>
        /// <returns>Session id</returns>
        public String Authenticate(string login, string password)
        {
            var url = String.Format("{0}?login={1}&password={2}", BuildUrl("User", "Auth"), login, password);

            try
            {
                var result = Get(url);
                SessionId = result.Data;
                _authenticatedTime = DateTime.Now;
            }
            catch (Exception)
            {
                SessionId = String.Empty;
            }

            return SessionId;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public Result Get(string url)
        {
            return Request(url, HttpMethod.Get, null);
        }

        /// <summary>
        /// Upload profile image for current user
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public string UploadUserProfileImage(byte[] bytes)
        {
            var file = new ByteArrayContent(bytes);

            file.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = "image.jpg",
                Name = "file"
            };

            var content = new MultipartFormDataContent();
            content.Add(new StringContent(this.SessionId), "sessionId");
            content.Add(file, "file");

            var url = BuildUrl("Storage", "UploadUserProfileImage");

            var client = new HttpClient();

            try
            {
                var response = client.PostAsync(url, content).Result;
                var readAsStringTask = response.Content.ReadAsStringAsync();
                var json = readAsStringTask.Result;
                var result = Result.Parse(json);

                return result.Data;
            }
            catch (Exception ex)
            {
                return String.Empty;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="form"></param>
        /// <returns></returns>
        public Result Post(string url, System.Collections.IDictionary form)
        {
            throw new NotImplementedException();

            foreach (var item in form)
            {

            }

            var json = "";
            return Result.Parse(json);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public
        Result Request(string url, HttpMethod method, byte[] bytes)
        {
            var handler = new HttpClientHandler();

            if (Proxy != null)
            {
                handler.UseDefaultCredentials = false;
                handler.Proxy = Proxy;
                handler.UseProxy = true;
            }

            var client = new HttpClient(handler);

            Task<String> result = null;

            if (method == HttpMethod.Get)
            {
                result = client.GetStringAsync(url);
            }
            else if (method == HttpMethod.Head)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Options)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Post)
            {
                var task = client.PostAsync(url, new ByteArrayContent(bytes));
                var responseMessage = task.Result;
                result = responseMessage.Content.ReadAsStringAsync();
            }
            else if (method == HttpMethod.Put)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Trace)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Delete)
            {
                throw new NotImplementedException();
            }

            var json = result.Result;

            return Result.Parse(json);
        }

        #region Async

        /// <summary>
        /// 
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<String> AuthenticateAsync(string login, string password)
        {
            var url = String.Format("{0}?login={1}&password={2}", BuildUrl("User", "Auth"), login, password);

            var task = GetAsync(url);
            SessionId = task.Result.Data;

            if (String.IsNullOrEmpty(SessionId))
            {
                throw new Exception("Access denied");
            }

            _authenticatedTime = DateTime.Now;

            return SessionId;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<Result> GetAsync(string url)
        {
            return await RequestAsync(url, HttpMethod.Get, null);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public async Task<Result> RequestAsync(string url, HttpMethod method, byte[] bytes)
        {
            var handler = new HttpClientHandler();

            if (Proxy != null)
            {
                //CookieContainer = cookies,
                //UseCookies = true,
                handler.UseDefaultCredentials = false;
                handler.Proxy = Proxy;
                handler.UseProxy = true;
            }

            var client = new HttpClient(handler);

            Task<String> result = null;

            if (method == HttpMethod.Get)
            {
                result = client.GetStringAsync(url);
            }
            else if (method == HttpMethod.Head)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Options)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Post)
            {
                var responseMessage = await client.PostAsync(url, new ByteArrayContent(bytes));
                result = responseMessage.Content.ReadAsStringAsync();
            }
            else if (method == HttpMethod.Put)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Trace)
            {
                throw new NotImplementedException();
            }
            else if (method == HttpMethod.Delete)
            {
                throw new NotImplementedException();
            }
            return Result.Parse(await result);
        }

        #endregion

        /// <summary>
        /// Build URL for API method
        /// </summary>
        /// <param name="controller">Contorller name</param>
        /// <param name="method">Method name</param>
        /// <param name="arguments">Line of arguments must be start with ? symbol</param>
        /// <returns>Url for method call</returns>
        public static string BuildUrl(string controller, string method, string arguments = "")
        {
            return String.Format("{0}{1}/{2}{3}", ApiEndpoint, controller, method, arguments);
        }
    }
}
