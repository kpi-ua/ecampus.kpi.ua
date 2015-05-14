using Newtonsoft.Json;
using System;
using System.Collections;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using Campus.SDK;
using Campus.SDK.Documentation;
using Campus.SDK.EventsArgs;
using PagedList;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public class ApiController : System.Web.Mvc.Controller, IApiController
    {
        private const string AccessDenied = "Access denied";

        protected const String MimeType = "application/json";

        public static bool UseJavaScriptStyleCamelcase { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether compression is allowed.
        /// </summary>
        /// <value>
        ///   <c>true</c> if compression is allowed; otherwise, <c>false</c>.
        /// </value>
        public static bool AllowCompression { get; set; }

        public static string DocumentationFilePath { get; set; }

        public static event EventHandler ExceptionHandled;

        public static event EventHandler ResultExecuted;

        static ApiController()
        {
            AllowCompression = false;
        }

        protected static void OnReseultExecuted(ApiController sender, string json)
        {
            var handler = ResultExecuted;

            if (handler != null)
            {
                handler(sender, new JsonEventArgs(json, sender.Request.Url));
            }
        }

        private static void OnExceptionHandled(ApiController sender, ExceptionContext exceptionContext)
        {
            var handler = ExceptionHandled;

            if (handler != null)
            {
                Uri url = null;

                if (exceptionContext.HttpContext != null && exceptionContext.HttpContext.Request != null)
                {
                    url = exceptionContext.HttpContext.Request.Url;
                }

                handler(sender, new ExceptionEventsArgs(exceptionContext.Exception, url));
            }
        }

        /// <summary>
        /// Serialize object to JSON
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        protected static string Serialize(object result)
        {
            //CamelCasePropertyNamesContractResolver

            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = Formatting.Indented,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            };

            if (UseJavaScriptStyleCamelcase)
            {
                settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            }

            var json = JsonConvert.SerializeObject(result, settings);
            return json;
        }

        /// <summary>
        /// Allow requests from other domains
        /// </summary>
        public static bool EnableCrossDomainRequest { get; set; }

        /// <summary>
        /// Time stamp for controller creating;
        /// </summary>
        private readonly DateTime _timeStamp;

        public ApiController()
        {
            _timeStamp = DateTime.Now;
        }

        public virtual ActionResult Result(object obj, HttpStatusCode status = HttpStatusCode.OK)
        {
            var result = new Result
            {
                StatusCode = (int)status,
                Data = obj,
            };

            if (obj is IPagedList)
            {
                result.Paging = new Campus.SDK.PagedList(obj as IPagedList);
                result.Data = (obj as IEnumerable).Cast<Object>().ToList();
            }

            Response.StatusCode = result.StatusCode;

            result.ExecutionTime = DateTime.Now.Subtract(_timeStamp).TotalMilliseconds.ToString("0.000000000");

            var json = Serialize(result);

            OnReseultExecuted(this, json);

            Response.Headers.Add("Executing-Time", DateTime.Now.Subtract(_timeStamp).ToString("g"));

            if (EnableCrossDomainRequest)
            {
                Response.Headers.Add("Access-Control-Allow-Origin", "*");
            }

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
            return Result(AccessDenied, HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult OK()
        {
            return Result("OK", HttpStatusCode.OK);
        }

        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Introspect()
        {
            //Default Introspect implementation

            var methods = GetType().GetMethods().ToList();

            methods = methods.AsParallel().Where(method => (method.ReturnType.BaseType == typeof(ActionResult) || method.ReturnType == typeof(ActionResult))
                                                           && method.Name != "Result"
                                                           && method.Name != "NotFound"
                                                           && method.Name != "Forbiden"
                                                           && method.Name != "Introspect"
                                                           && method.Name != "ValidateUser"
                                                           && method.Name != "OK"
                                                           && method.IsPublic).ToList();

            var info = methods.Select(method => IntrospectMethod(method)).ToList();

            return Result(info);
        }

        protected virtual void OnException(Exception ex)
        {
            var handler = ExceptionHandled;

            if (handler != null)
            {
                Uri url = null;

                if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.Request != null)
                {
                    url = System.Web.HttpContext.Current.Request.Url;
                }

                handler(this, new ExceptionEventsArgs(ex, url));
            }
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            //Send exception for debug
            OnExceptionHandled(this, filterContext);

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

            if (filterContext.Exception is HttpException)
            {
                var httpException = filterContext.Exception as HttpException;
                var httpCode = httpException.GetHttpCode();

                if (Enum.IsDefined(typeof(HttpStatusCode), httpCode))
                {
                    code = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), httpCode.ToString());
                }
            }

            //NotImplemented
            filterContext.Result = Result(filterContext.Exception.Message, code);

            //Make sure that we mark the exception as handled
            filterContext.ExceptionHandled = true;

            filterContext.HttpContext.Response.StatusCode = Convert.ToInt32(code);
            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
        }

        protected virtual dynamic IntrospectMethod(MethodInfo method)
        {
            var isHttPost = method.CustomAttributes.Any(o => o.AttributeType.Name == "HttpPostAttribute");

            var parameters = method.GetParameters()
                .AsParallel()
                .Select(o => new TypeDescription(o, ApiDocumentation.GetDescription(method, o)))
                .ToList();

            var description = ApiDocumentation.GetDescription(method, null);

            return new MethodDescription
            {
                Name = method.Name,
                Method = isHttPost ? "POST" : "GET",
                Description = description,
                Parameters = parameters
            };
        }

        /// <summary>
        /// Validate sessionId token and user object. If either is null, then return 403 and "Access denied message"
        /// </summary>
        /// <param name="sessionId"></param>
        /// <param name="user"></param>
        protected virtual void ValidateUser(string sessionId, dynamic user)
        {
            if (String.IsNullOrEmpty(sessionId) || user == null)
            {
                throw new HttpException(Convert.ToInt32(HttpStatusCode.Forbidden), AccessDenied);
            }
        }
    }
}
