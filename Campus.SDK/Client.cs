using System.Net.Http;

namespace Campus.SDK
{
    public class Client : AsyncClient
    {
        /// <summary>
        /// Authenticate user in ecampus
        /// </summary>
        /// <param name="login">User login</param>
        /// <param name="password">User password</param>
        /// <returns>Session id</returns>
        public new string Authenticate(string login, string password)
        {
            var asyncResult = base.Authenticate(login, password);
            return asyncResult.Result;
        }

        public new Result Get(string url)
        {
            var asyncResult = base.Get(url, HttpMethod.Get, null);
            return asyncResult.Result;
        }

        public new Result Get(string url, HttpMethod method, byte[] bytes)
        {
            var asyncResult = base.Get(url, method, bytes);
            return asyncResult.Result;
        }
    }
}
