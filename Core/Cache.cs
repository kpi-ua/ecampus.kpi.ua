using System.Web;
using NLog;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace Core
{
    public static class Cache
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();

        private static readonly HashSet<string> _keys = new HashSet<string>();
        public static void Set(string url, HttpMethod method, byte[] form, string json)
        {
            var key = GenerateKey(url, method, form);

            _logger.Info("set: " + key + " : " + json);

            if (form != null || !url.Contains("GetCurrent"))
            {
                return;
            }
            
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
                //WebCache.Remove(key);
                HttpContext.Current.Cache.Remove(key);
            }

            _keys.Clear();
        }

        private static void Set(string key, string value)
        {
            _keys.Add(key);
            //WebCache.Set(key, value, 5);
            HttpContext.Current.Cache[key] = value;
        }

        private static string Get(string key)
        {
            var data = HttpContext.Current.Cache[key];
            //var data = WebCache.Get(key);

            _logger.Info("get: " + key + " : " + data);

            if (data == null)
            {
                return String.Empty;
            }

            return data.ToString();
        }
    }
}
