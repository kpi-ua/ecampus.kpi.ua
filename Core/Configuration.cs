using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;

namespace Core
{
    /// <summary>
    /// Application global configuration manager
    /// </summary>
    public class Configuration : Campus.SDK.Configuration
    {
        public Configuration(IDictionary<string, string> settings)
            : base(settings)
        {
        }

        private static Configuration _current;

        public static Configuration Current
        {
            get
            {
                var settings = WebConfigurationManager.AppSettings.Cast<String>().ToDictionary(p => p, p => WebConfigurationManager.AppSettings[p]);
                return _current ?? (_current = new Configuration(settings));
            }
        }

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
                name: "Support",
                url: "support",
                defaults: new { controller = "Home", action = "Support" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
