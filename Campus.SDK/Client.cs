using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Campus.SDK
{
    /// <summary>
    /// ecampus client
    /// </summary>
    public class Client
    {
        public const string ApiEndpoint = "http://api.ecampus.kpi.ua/";
        
        public string SessionId { get; private set; }

        public Client()
        {
            //_webClient = new WebClient();
            SessionId = String.Empty;
        }

        /// <summary>
        /// Authenticate user in ecampus
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="password">User password</param>
        /// <returns>Session id</returns>
        public string Authenticate(string login, string password)
        {
            var url = String.Format("{0}user/auth?login={1}&password={2}", ApiEndpoint, login, password);

            var result = Get(url);
            SessionId = result.Data;

            if (String.IsNullOrEmpty(SessionId))
            {
                throw new Exception("Access denied");
            }

            return SessionId;
        }

        public Result Get(string url)
        {
            return Get(url, HttpMethod.Get, null);
        }

        public Result Get(string url, HttpMethod method, byte[] bytes)
        {
            var client = new HttpClient();
            Task<String> data = null;

            if (method == HttpMethod.Get)
            {
                data = client.GetStringAsync(url);
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
                var asyncResponse = client.PostAsync(new Uri(url), new ByteArrayContent(bytes));
                data = asyncResponse.Result.Content.ReadAsStringAsync();
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

            var json = data.Result;

            return Result.Parse(json);
        }
    }
}