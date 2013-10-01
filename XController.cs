using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace Campus.Core
{
    public abstract class XController : Controller
    {
        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        public virtual JsonResult Introspect()
        {
            //Default Introspect implementation

            var type = this.GetType();

            var methods = (from method in type.GetMethods()
                           where
                               method.ReturnType.BaseType == typeof(ActionResult) ||
                               method.ReturnType == typeof(ActionResult)
                           select IntrospectMethod(method)).ToList();

            return Json(methods, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Index()
        {
            return Introspect();
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
