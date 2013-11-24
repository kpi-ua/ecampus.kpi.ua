using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Campus.Core
{
    public abstract class ApiApplication : System.Web.HttpApplication
    {
        public ApiApplication()
        {
            MvcHandler.DisableMvcResponseHeader = true;

            this.EndRequest += Application_EndRequest;
        }

        private void Application_EndRequest(object sender, EventArgs e)
        {
            //For handling all requests that not handled by other controllers
           
            if (Context.Response.StatusCode == 404)
            {
                Response.Clear();

                var routeData = new RouteData();
                routeData.Values["controller"] = "XController";
                routeData.Values["action"] = "NotFound";

                IController controller = new ApiController();
                controller.Execute(new RequestContext(new HttpContextWrapper(Context), routeData));
            }
        }
    }
}
