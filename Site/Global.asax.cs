using Core;
using System.Web.Mvc;
using System.Web.Routing;

namespace Site
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            Configuration.RegisterRoutes(RouteTable.Routes);

            if (Core.Configuration.Current.ProxyEnabled)
            {
                Campus.SDK.Client.Proxy = Core.Configuration.Current.Proxy;
            }

            Campus.SDK.Client.SetCustomEndpoint(Core.Configuration.Current.ApiEndpoint);


            Campus.SDK.Client.GetFromCache += Cache.Get;
            Campus.SDK.Client.AddToCache += Cache.Set;
        }
    }
}
