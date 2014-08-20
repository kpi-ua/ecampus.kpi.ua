using System;
using System.Net;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;

namespace Core
{
    /// <summary>
    /// Application global configuration manager
    /// </summary>
    public class Configuration
    {
        private Configuration()
        {
            ProxyEnabled = Convert.ToBoolean(WebConfigurationManager.AppSettings["campus-proxy-enabled"]);

            if (ProxyEnabled)
            {
                Proxy = new WebProxy(String.Format("{0}:{1}", WebConfigurationManager.AppSettings["campus-proxy-host"], WebConfigurationManager.AppSettings["campus-proxy-port"]), true)
                {
                    Credentials = new NetworkCredential(WebConfigurationManager.AppSettings["campus-proxy-login"], WebConfigurationManager.AppSettings["campus-proxy-password"])
                };
            }

            ApiEndpoint = Convert.ToString(WebConfigurationManager.AppSettings["campus-api-endpoint"]);
        }

        public WebProxy Proxy { get; set; }
        public bool ProxyEnabled { get; set; }
        public string ApiEndpoint { get; set; }
       
        private static Configuration _current;

        public static Configuration Current
        {
            get { return _current ?? (_current = new Configuration()); }
        }

        public const int OutputCacheDuration = 60 * 15;

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Login",
                url: "login",
                defaults: new { controller = "System", action = "Login" }
            );

            routes.MapRoute(
                name: "Logout",
                url: "logout",
                defaults: new { controller = "System", action = "Logout" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
