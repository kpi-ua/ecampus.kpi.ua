using Newtonsoft.Json;
using PagedList;
using System;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public abstract class XController : Controller
    {
        public const string JsonMimeType = "application/json";

        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Introspect()
        {
            //Default Introspect implementation

            var type = GetType();

            var methods = (from method in type.GetMethods()
                           where
                               method.ReturnType.BaseType == typeof(ActionResult) ||
                               method.ReturnType == typeof(ActionResult)
                           select IntrospectMethod(method)).ToList();

            return Result(methods);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Index()
        {
            return Introspect();
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            //If the exeption is already handled we do nothing
            if (filterContext.ExceptionHandled)
            {
                return;
            }

            Response.StatusCode = 500;
            filterContext.Result = Result(filterContext.Exception.Message, Status.Error);

            //Make sure that we mark the exception as handled
            filterContext.ExceptionHandled = true;
        }

        /// <summary>
        /// Return formatted result
        /// </summary>
        /// <param name="data"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        protected ActionResult Result(object data, string status = Status.OK)
        {
            String json;

            try
            {
                var result = new Result
                {
                    Status = status,
                    Data = data,
                    Paging = data is IPagedList ? new Paging((data as PagedList<dynamic>).GetMetaData()) : null
                };

                var settings = new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.IsoDateFormat,
                };

                json = JsonConvert.SerializeObject(result, Formatting.Indented, settings);

            }
            catch (Exception ex)
            {
                return Result(ex.Message, Status.Error);
            }

            return Content(json, JsonMimeType);
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
