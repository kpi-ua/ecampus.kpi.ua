using System.Net.Http;

namespace Campus.SDK
{
    /// <summary>
    /// 
    /// </summary>
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public new Result Get(string url)
        {
            var asyncResult = base.Request(url, HttpMethod.Get, null);
            return asyncResult.Result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public new Result Request(string url, HttpMethod method, byte[] bytes)
        {
            var asyncResult = base.Request(url, method, bytes);
            return asyncResult.Result;
        }
    }
}
