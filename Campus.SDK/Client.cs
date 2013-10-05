using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Authentication;
using System.Web;
using Newtonsoft.Json;

namespace Campus.SDK
{
    /// <summary>
    /// 
    /// </summary>
    public class Client
    {
        public static string ApiEndpoint { get; set; }

        static Client()
        {
            ApiEndpoint = "http://api.ecampus.kpi.ua/";
        }


        private string _sessionId;

        public Client()
        {
            //_webClient = new WebClient();
            _sessionId = String.Empty;
        }

        public string Authenticate(string login, string password)
        {
            var url = String.Format("{0}auth", ApiEndpoint);

            _sessionId = CreateGetRequest(url, new NameValueCollection { { "login", login }, { "password", password } });

            if (String.IsNullOrEmpty(_sessionId))
            {
                throw new AuthenticationException();
            }

            return _sessionId;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="query"></param>
        /// <param name="arguments"></param>
        /// <param name="method">Request method</param>
        /// <returns></returns>
        public Campus.Core.Result Call(string query, NameValueCollection arguments = null, HttpRequestMethod method = HttpRequestMethod.GET)
        {
            var url = String.Format("{0}{1}", ApiEndpoint, query);

            var json = String.Empty;

            switch (method)
            {
                case HttpRequestMethod.GET:
                    json = CreateGetRequest(url, arguments);
                    break;
                case HttpRequestMethod.HEAD:
                    break;
                case HttpRequestMethod.POST:
                    json = CreatePostRequest(url, arguments);
                    break;
                case HttpRequestMethod.PUT:
                    throw new NotImplementedException();
                    break;
                case HttpRequestMethod.DELETE:
                    throw new NotImplementedException();
                    break;
                case HttpRequestMethod.TRACE:
                    throw new NotImplementedException();
                    break;
                case HttpRequestMethod.OPTIONS:
                    throw new NotImplementedException();
                    break;
                case HttpRequestMethod.CONNECT:
                    throw new NotImplementedException();
                    break;
                case HttpRequestMethod.PATCH:
                    throw new NotImplementedException();
                    break;
                default:
                    throw new NotImplementedException();
                    break;
            }

            var result = Campus.Core.Result.Parse(json);

            return result;
        }

        private static string CreateGetRequest(String url, NameValueCollection collection)
        {
            if (collection != null && collection.Count > 0)
            {
                var queryString = ConstructQueryString(collection);
                url = String.Format("{0}?{1}", url, queryString);
            }

            var request = (HttpWebRequest)WebRequest.Create(url);


            var response = request.GetResponse();
            var responseStream = response.GetResponseStream();
            string data;

            using (var reader = new StreamReader(responseStream))
            {
                data = reader.ReadToEnd();
            }

            return data;
        }

        private static string CreatePostRequest(String url, NameValueCollection collection)
        {
            // Here we create the request and write the POST data to it.
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";

            if (collection != null && collection.Count > 0)
            {
                var queryString = ConstructQueryString(collection);

                using (var writer = new StreamWriter(request.GetRequestStream()))
                {
                    writer.Write(queryString);
                }
            }

            var response = request.GetResponse();
            var stream = response.GetResponseStream();

            string data;

            using (var reader = new StreamReader(stream))
            {
                data = reader.ReadToEnd();
            }

            return data;
        }

        private static String ConstructQueryString(NameValueCollection collection)
        {
            var values = (from string name in collection
                          select String.Concat(name, "=", HttpUtility.UrlEncode(collection[name])));

            return String.Join("&", values);
        }

        public T Call<T>(string query, NameValueCollection arguments = null, HttpRequestMethod method = HttpRequestMethod.GET)
        {
            var result = Call(query, arguments, method);

            var json = result.Data.ToString();

            //if (typeof(T) == typeof(DataTable))
            //{
            //    return JsonConvert.DeserializeObject<DataTable>(json);
            //}

            //return (T)result.Data;

            return JsonConvert.DeserializeObject<T>(json);
        }
    }

}
