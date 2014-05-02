using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Site
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            Config.RegisterRoutes(RouteTable.Routes);
			
			var proxy = new WebProxy("10.13.100.13:3128", true)
            {
                Credentials = new NetworkCredential("kbis_user", "kbis13")
            };
            
            //Client.Proxy = proxy;

            Campus.SDK.Client.GetFromCache += Cache.Get;
            Campus.SDK.Client.AddToCache += Cache.Set;
        }
    }
}
