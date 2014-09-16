using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Core.Doska
{
    public static  class Static
    {
        public static string MakeRequest(string url)
        {
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                return (new StreamReader(response.GetResponseStream())).ReadToEnd();
            }
        }

        public static T MakeRequest<T>(string url)
        {
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                StreamReader reader = new StreamReader(response.GetResponseStream());
                return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(reader.ReadToEnd().ClearResponse());
            }
        }

        public static string ToStringList<T>(this List<T> list, Func<T,string> func)
        {
            string result = "";
            foreach (var item in list)
            {
                result += func(item) + "\n";
            }
            return result;
        }

        public static string ClearResponse(this string resp)
        {
            string[] r = resp.Split(new[] { "\"Data\":" }, StringSplitOptions.RemoveEmptyEntries);
            r[1] = r[1].Substring(0, r[1].Length - 1);
            return r[1];
        }
    }
}
