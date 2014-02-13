using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace Core
{
    public static class Cache
    {
        private static readonly HashSet<string> _keys = new HashSet<string>();
        public static void Set(string url, HttpMethod method, byte[] form, string json)
        {
            if (form != null)
            {
                return;
            }

            var key = GenerateKey(url, method, form);
            Set(key, json);
        }

        public static string Get(string url, HttpMethod method, byte[] form)
        {
            var key = GenerateKey(url, method, form);
            return Get(key);
        }

        private static string GenerateKey(string url, HttpMethod method, byte[] form)
        {
            var value = String.Format("{0}-{1}-{2}",
                url.ToLower(), form == null ? "null" : form.Length.ToString(), Convert.ToString(method));

            return value;
        }

        public static void InvalidateCache()
        {
            foreach (var key in _keys)
            {
                WebCache.Remove(key);
            }

            _keys.Clear();
        }

        public static void Set(string key, string value)
        {
            _keys.Add(key);
            WebCache.Set(key, value, 5);
        }

        public static string Get(string key)
        {
            var data = WebCache.Get(key);

            if (data == null)
            {
                return String.Empty;
            }

            return data.ToString();
        }
    }
}
