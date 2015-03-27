using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Example
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Campus.Core.ApiController.DocumentationFilePath = HttpContext.Current.Server.MapPath("~/api.xml");

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
