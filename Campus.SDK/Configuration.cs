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

        public Configuration()
        {
        }

        public Configuration(IDictionary<string, string> settings)
        {
            ProxyEnabled = Convert.ToBoolean(settings["campus-proxy-enabled"]);

            if (ProxyEnabled)
            {
                Proxy = new Proxy(String.Format("{0}:{1}", settings["campus-proxy-host"], settings["campus-proxy-port"]), true)
                {
                    Credentials = new NetworkCredential(settings["campus-proxy-login"], settings["campus-proxy-password"])
                };
            }

            ApiEndpoint = Convert.ToString(settings["campus-api-endpoint"]);
        }

        public IWebProxy Proxy { get; set; }
        public bool ProxyEnabled { get; set; }
        public string ApiEndpoint { get; set; }

        public const int OutputCacheDuration = 60 * 15;

    }
}
