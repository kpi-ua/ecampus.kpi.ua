using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.IO;
using System.Net;
using System.Web;
using System.Xml.Serialization;

namespace SDK
{
    /// <summary>
    /// 
    /// </summary>
    public class Client
    {
        private const string ApiEndpoint = "http://api.ecampus.kpi.ua/";
        private Cookie _currentCookie;

        public Client()
        {
            //_webClient = new WebClient();
        }

        public bool InitializeSession(Cookie cookie)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="class"></param>
        /// <param name="method"></param>
        /// <param name="format"></param>
        /// <param name="arguments"></param>
        /// <param name="requestMethod"></param>
        /// <returns></returns>
        public object Call(string @class, string method, DataFormat format = DataFormat.Json, NameValueCollection arguments = null, HttpRequestMethod requestMethod = HttpRequestMethod.GET)
        {
            var url = String.Format("{0}{1}/{2}/{3}", ApiEndpoint, @class, method, ToString(format));

            if (requestMethod == HttpRequestMethod.POST)
            {
                return CreatePostRequest(url, arguments, _currentCookie);
            }

            if (requestMethod == HttpRequestMethod.GET)
            {
                return CreateGetRequest(url, arguments, _currentCookie);
            }

            throw new NotSupportedException();
        }

        public string ToString(DataFormat format)
        {
            switch (format)
            {
                case DataFormat.Json: return "json";
                case DataFormat.Xml: return "xml";
                default: throw new NotSupportedException("data format not supported");
            }
        }

        public DataTable CallDataTable(string @class, string method, NameValueCollection arguments = null)
        {
            var xml = Call(@class, method, DataFormat.Xml, arguments);

            var serializer = new XmlSerializer(typeof(DataTable));
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(xml);
            writer.Flush();
            stream.Position = 0;

            var result = (DataTable)serializer.Deserialize(stream);
            return result;
        }
        
        private static string CreateGetRequest(String url, NameValueCollection collection, Cookie currentCookie = null)
        {
            if (collection != null && collection.Count > 0)
            {
                var queryString = ConstructQueryString(collection);
                url = String.Format("{0}?{1}", url, queryString);
            }

            var request = (HttpWebRequest)WebRequest.Create(url);

            if (currentCookie != null)
            {
                request.CookieContainer = new CookieContainer();
                request.CookieContainer.Add(currentCookie);
            }

            var response = request.GetResponse();
            var responseStream = response.GetResponseStream();
            string data;

            using (var reader = new StreamReader(responseStream))
            {
                data = reader.ReadToEnd();
            }

            return data;
        }

        private static string CreatePostRequest(String url, NameValueCollection collection, Cookie currentCookie = null)
        {
            // Here we create the request and write the POST data to it.
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";

            if (currentCookie != null)
            {
                request.CookieContainer = new CookieContainer();
                request.CookieContainer.Add(currentCookie);
            }

            if (collection != null && collection.Count > 0)
            {
                var queryString = ConstructQueryString(collection);

                using (var writer = new StreamWriter(request.GetRequestStream()))
                {
                    writer.Write(queryString);
                }
            }

            var response = request.GetResponse();
            var responseStream = response.GetResponseStream();
            string data;

            using (var reader = new StreamReader(responseStream))
            {
                data = reader.ReadToEnd();
            }

            return data;
        }

        private static String ConstructQueryString(NameValueCollection collection)
        {
            var items = new List<String>();

            foreach (String name in collection)
            {
                items.Add(String.Concat(name, "=", HttpUtility.UrlEncode(collection[name])));
            }

            return String.Join("&", items.ToArray());
        }
    }

}
