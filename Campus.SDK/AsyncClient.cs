using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Campus.SDK
{
    /// <summary>
    /// ecampus client
    /// </summary>
    public class AsyncClient
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

        public async Task<Result> Get(string url)
        {
            return await Get(url, HttpMethod.Get, null);
        }

        public async Task<Result> Get(string url, HttpMethod method, byte[] bytes)
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
    }
}