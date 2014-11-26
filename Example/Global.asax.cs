using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Campus.Core.Documentation;

namespace Example
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Campus.Core.ApiController.DocumentationFilePath = HttpContext.Current.Server.MapPath("~/api.xml");
            Campus.Core.ApiController.DocumentationProviderProject = "Example";

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            XmlDocumentation.Generate();
        }
    }
}
