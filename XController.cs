using System;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Mvc;
using Newtonsoft.Json;
using PagedList;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public abstract class XController : Controller
    {
        public const string JsonMimeType = "application/json";

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
            return Content(json, "application/json");
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

        private static dynamic IntrospectMethod(MethodInfo method)
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
    }
}
