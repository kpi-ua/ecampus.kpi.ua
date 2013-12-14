using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Campus.SDK
{
    /// <summary>
    /// ecampus client
    /// </summary>
    public class AsyncClient : HttpClient
    {
        public const string ApiEndpoint = "http://api.ecampus.kpi.ua/";

        private DateTime _authenticatedTime;
        public string SessionId { get; private set; }

        /// <summary>
        /// by default session has expire time. This property retrn that your session is valid.
        /// </summary>
        public bool SessionIsActual
        {
            get { return _authenticatedTime.AddMinutes(18) > DateTime.Now; }
        }

        public AsyncClient()
        {
            SessionId = String.Empty;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="login"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<String> Authenticate(string login, string password)
        {
            var url = String.Format("{0}user/auth?login={1}&password={2}", ApiEndpoint, login, password);

            var result = await Get(url);
            SessionId = result.Data;

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
        public async Task<Result> Get(string url)
        {
            return await Request(url, HttpMethod.Get, null);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public async Task<Result> Request(string url, HttpMethod method, byte[] bytes)
        {
            var client = new HttpClient();
            String data = null;

            if (method == HttpMethod.Get)
            {
                data = await client.GetStringAsync(url);
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
                var asyncResponse = await client.PostAsync(new Uri(url), new ByteArrayContent(bytes));
                data = await asyncResponse.Content.ReadAsStringAsync();
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

            var json = data;

            return Result.Parse(json);
        }

        /// <summary>
        /// Build URL for API method
        /// </summary>
        /// <param name="controller">Contorller name</param>
        /// <param name="method">Method name</param>
        /// <returns>Url for method call</returns>
        public static string BuildUrl(string controller, string method)
        {
            return String.Format("{0}{1}/{2}", ApiEndpoint, controller, method);
        }
    }
}