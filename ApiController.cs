using Newtonsoft.Json;
using PagedList;
using System;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web.Mvc;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public class ApiController : Controller
    {
        protected const String MimeType = "application/json";

        /// <summary>
        /// Time stamp for controller creating;
        /// </summary>
        private readonly DateTime _timeStamp;

        public ApiController()
        {
            _timeStamp = DateTime.Now;
        }

        public ActionResult Result(object obj, HttpStatusCode status = HttpStatusCode.OK)
        {
            var result = new Result
            {
                StatusCode = status,
                Data = obj
            };

            if (obj is IPagedList)
            {
                var pagedList = obj as IPagedList<object>;

                result.Paging = new Paging(pagedList);
                result.Data = pagedList.ToList();
            }

            Response.StatusCode = Convert.ToInt32(result.StatusCode);

            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = Formatting.Indented
            };

            var json = JsonConvert.SerializeObject(result, settings);

            Response.Headers.Add("Executing-Time", DateTime.Now.Subtract(_timeStamp).ToString("g"));

            return Content(json, MimeType);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult NotFound()
        {
            return Result(Request.Url, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult Forbiden()
        {
            return Result("Access denied", HttpStatusCode.Forbidden);
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
                               && method.Name != "Result"
                               && method.Name != "NotFound"
                               && method.Name != "Forbiden"
                               && method.Name != "Introspect"
                               && method.IsPublic
                           select IntrospectMethod(method)).ToList();

            return Result(methods);
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            //If the exeption is already handled we do nothing
            if (filterContext.ExceptionHandled)
            {
                return;
            }

            var code = HttpStatusCode.InternalServerError;

            if (filterContext.Exception is NotImplementedException)
            {
                code = HttpStatusCode.NotImplemented;
            }

            //NotImplemented
            filterContext.Result = Result(filterContext.Exception.Message, code);

            //Make sure that we mark the exception as handled
            filterContext.ExceptionHandled = true;

            filterContext.HttpContext.Response.StatusCode = Convert.ToInt32(code);
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
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
    }
}
