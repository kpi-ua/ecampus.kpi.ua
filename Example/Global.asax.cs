using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Example
{
    /// <summary>
    /// Base class for test web application
    /// </summary>
    public class MvcApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// 
        /// </summary>
        protected void Application_Start()
        {
            Campus.Core.ApiController.DocumentationFilePath = HttpContext.Current.Server.MapPath("~/api.xml");

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
