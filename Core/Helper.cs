using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using NLog;

namespace Core
{
    public static class Helper
    {
        private static WebClient _client;

        public static Dictionary<String, object> GetData(string url)
        {
            try
            {
                //TODO: Replace by this:
                //var client = new Campus.SDK.Client();
                //var result = client.Get(request);

                var json = DownloadString(url);
                var serializer = new JavaScriptSerializer();
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                return respDictionary;
            }
            catch (Exception ex)
            {
                var logger = LogManager.GetCurrentClassLogger();
                logger.ErrorException("Helper:GetData", ex);
                return null;
            }
        }
        public static string DownloadString(string url)
        {
            var text = Cache.Get(url);

            if (String.IsNullOrEmpty(text))
            {
                var client = CreateWebClient();
                text = client.DownloadString(url);
                Cache.Set(url, text);
                return text;
            }
            else
            {
                return text;
            }
        }

        private static WebClient CreateWebClient()
        {
            if (_client == null)
            {
                _client = new WebClient
                {
                    Encoding = System.Text.Encoding.UTF8
                };

                if (Campus.SDK.Client.Proxy != null)
                {
                    _client.Proxy = Campus.SDK.Client.Proxy;
                }
            }

            return _client;
        }

        public static void CreateErrorMessage(HtmlGenericControl target)
        {
            target.Controls.Clear();
            var error = new HtmlGenericControl("h2");
            error.InnerText = "Помилка при завантаженні сторінки!!!";
            target.Controls.Add(error);
        }
    }
}