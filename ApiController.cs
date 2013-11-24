using Newtonsoft.Json;
using PagedList;
using System;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public class ApiController : Controller
    {

        /// <summary>
        /// Time stamp for controller creating;
        /// </summary>
        private readonly DateTime _timeStamp;

        public const string JsonMimeType = "application/json";

        public ApiController()
        {
            _timeStamp = DateTime.Now;
        }

        public ActionResult Result(object obj, HttpStatusCode status = HttpStatusCode.OK)
        {
            var result = new Result()
            {
                StatusCode = status,
                Data = obj
            };

            if (obj is IPagedList)
            {
                result.Paging = new Paging((obj as IPagedList));
            }

            Response.StatusCode = Convert.ToInt32(result.StatusCode);

            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = Formatting.Indented
            };

            var json = JsonConvert.SerializeObject(result, settings);

            var time = DateTime.Now - _timeStamp;
            Response.Headers.Add("Executing-Time", time.ToString("g"));

            return Content(json, "application/json");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult NotFound()
        {
            return Result(Request.Url, HttpStatusCode.NotFound);
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            //If the exeption is already handled we do nothing
            if (filterContext.ExceptionHandled)
            {
                return;
            }

            filterContext.Result = Result(filterContext.Exception.Message, HttpStatusCode.InternalServerError);

            //Make sure that we mark the exception as handled
            filterContext.ExceptionHandled = true;

            filterContext.HttpContext.Response.StatusCode = Convert.ToInt32(HttpStatusCode.InternalServerError);
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;

        }

        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Introspect()
        {
            //Default Introspect implementation

            var methods = (from method in GetType().GetMethods()
                           where
                               (method.ReturnType.BaseType == typeof(ActionResult) ||
                                method.ReturnType == typeof(ActionResult))
                               && method.Name != "Introspect"
                               && method.Name != "Result"
                               && method.IsPublic
                           select IntrospectMethod(method)).ToList();

            return Result(methods);
        }

        protected static dynamic IntrospectMethod(MethodInfo method)
        {
            return new
            {
                method.Name,
                Parameters = method.GetParameters().Select(o => new
                {
                    o.Name,
                    Type = o.ParameterType.ToString()
                }).ToList()
            };
        }

        /// <summary>
        /// For handling all requests that not handled by other controllers
        /// </summary>
        /// <param name="application"></param>
        public static void HandleHttpNotFound(HttpApplication application)
        {
            application.Response.Clear();

            var routeData = new RouteData();
            routeData.Values["controller"] = "XController";
            routeData.Values["action"] = "NotFound";

            IController controller = new ApiController();
            controller.Execute(new RequestContext(new HttpContextWrapper(application.Context), routeData));
        }
    }
}
