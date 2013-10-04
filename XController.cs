using System;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public abstract class XController : Controller
    {
        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Introspect()
        {
            //Default Introspect implementation

            var type = this.GetType();

            var methods = (from method in type.GetMethods()
                           where
                               method.ReturnType.BaseType == typeof(ActionResult) ||
                               method.ReturnType == typeof(ActionResult)
                           select IntrospectMethod(method)).ToList();

            return Result(methods);
            //return Json(methods, JsonRequestBehavior.AllowGet);
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
            filterContext.Result = Result(filterContext.Exception.Message);

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
            Result result;

            try
            {
                result = new Result
                {
                    Status = status,
                    Data = data
                };
            }
            catch (Exception ex)
            {
                return Result(ex.Message, Status.Error);
            }

            var settings = new JsonSerializerSettings() { DateFormatHandling = DateFormatHandling.IsoDateFormat };
            var json = JsonConvert.SerializeObject(result, settings);
            return Content(json, "application/json");
            //return Json(result, JsonRequestBehavior.AllowGet);
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
