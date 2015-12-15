using System;
using System.Collections.Generic;
using System.Net;

namespace Campus.SDK
{
    /// <summary>
    /// Application global configuration manager
    /// </summary>
    public class Configuration
    {
        private static class Fields
        {
            public const string ProxyEnabled = "campus-proxy-enabled";
            public const string ProxyLogin = "campus-proxy-login";
            public const string ProxyPassword = "campus-proxy-password";
            public const string ProxyHost = "campus-proxy-host";
            public const string ProxyPort = "campus-proxy-port";
            public const string ApiEndpoint = "campus-api-endpoint";
        }

        public Configuration()
        {
        }

        public Configuration(IDictionary<string, string> settings)
            : this()
        {
            Initialize(settings);
        }

        private void Initialize(IDictionary<string, string> settings)
        {
            ProxyEnabled = TryGetValue(settings, Fields.ProxyEnabled, false);
            ProxyPort = TryGetValue(settings, Fields.ProxyPort, 3128);
            ProxyHost = TryGetValue(settings, Fields.ProxyHost, String.Empty);
            ProxyCredential = new NetworkCredential(
                TryGetValue(settings, Fields.ProxyLogin, String.Empty),
                TryGetValue(settings, Fields.ProxyPassword, String.Empty));

            ApiEndpoint = Convert.ToString(TryGetValue(settings, Fields.ApiEndpoint, "http://api.ecampus.kpi.ua/"));
        }

        #region TryGetValue

        private static int TryGetValue(IDictionary<string, string> settings, string name, int defaultValue)
        {
            String value;

            if (settings == null || !settings.TryGetValue(name, out value)) return defaultValue;
           
            int result;

            if (int.TryParse(value, out result))
            {
                return result;
            }

            return defaultValue;
        }

        private static bool TryGetValue(IDictionary<string, string> settings, string name, bool defaultValue)
        {
            String value;

            if (settings != null && settings.TryGetValue(name, out value))
            {
                bool result;

                if (bool.TryParse(value, out result))
                {
                    return result;
                }
            }

            return defaultValue;
        }

        private static string TryGetValue(IDictionary<string, string> settings, string name, string defaultValue)
        {
            String result;

            if (settings != null && settings.TryGetValue(name, out result))
            {
                return result;
            }

            return defaultValue;
        }

        #endregion

        public NetworkCredential ProxyCredential { get; protected set; }
        public int ProxyPort { get; protected set; }
        public string ProxyHost { get; protected set; }
        public bool ProxyEnabled { get; protected set; }
        public string ApiEndpoint { get; protected set; }

        public const int OutputCacheDuration = 60 * 15;
    }
}
