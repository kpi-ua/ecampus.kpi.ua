using Campus.Core.Attributes;
using Campus.Core.Documentation;
using Campus.Core.EventsArgs;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    [CompressNative]
    public class ApiController : System.Web.Mvc.Controller
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

        public static bool EnableExtendedDocumentation { get; set; }

        public static string DocumentationFilePath { get; set; }

        public static string DocumentationProviderProject { get; set; }

        public static event EventHandler ExceptionHandled;

        public static event EventHandler ResultExecuted;

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
            var callerMethod = GetCallerMethod();
            var type = GetType();

            var result = new Result
            {
                StatusCode = status,
                Data = obj,
            };

            if (AllowCompression)
                if (ShouldBeCompressed)
                {
                    BuildCompressionInfo(result, obj, type, callerMethod);
                }
                else
                {
                    var native = type.GetCustomAttribute<CompressNativeAttribute>(false);
                    native = native ?? type.GetCustomAttribute<CompressNativeAttribute>(true);
                    if (native != null)
                    {
                        result.Compression = new
                        {
                            Native = new
                            {
                                Type = Enum.GetName(native.PreferredEncoding.GetType(), native.PreferredEncoding),
                                Lavel = Enum.GetName(native.Level.GetType(), native.Level)
                            }
                        };
                    }
                }

            Response.StatusCode = Convert.ToInt32(result.StatusCode);

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
        [CompressIgnore]
        public ActionResult NotFound()
        {
            return Result(Request.Url, HttpStatusCode.NotFound);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [CompressIgnore]
        public ActionResult Forbiden()
        {
            return Result(AccessDenied, HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [CompressIgnore]
        public ActionResult OK()
        {
            return Result("OK", HttpStatusCode.OK);
        }

        /// <summary>
        /// Method return information about another method supported by controller
        /// </summary>
        /// <returns></returns>
        [CompressIgnore]
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
            var message = String.Empty;

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

        [CompressIgnore]
        protected static dynamic IntrospectMethod(MethodInfo method)
        {
            var isHttPost = method.CustomAttributes.Any(o => o.AttributeType.Name == "HttpPostAttribute");
            var isReference = ReferenceAttribute.Instance.HasAttribute(method);
            var isCompression = !CompressIgnoreAttribute.Instance.HasAttribute(method.DeclaringType) &&
                                !CompressIgnoreAttribute.Instance.HasAttribute(method) &&
                                CompressAttribute.Instance.HasAttribute(method);

            CompressAttribute compression = null;
            if (isCompression)
            {
                compression = method.GetCustomAttribute<CompressAttribute>(true);
            }

            var parameters = method.GetParameters().AsParallel()
                .Where(p => !NonSerializableParameterAttribute.Instance.HasAttribute(p))
                .Select(o => new
                {
                    o.Name,
                    Type = o.ParameterType.ToString(),
                    Description = GetDescription(method, o),
                }).ToList();

            var description = GetDescription(method, null);

            return new
            {
                method.Name,
                Method = isHttPost ? "POST" : "GET",
                Description = description,
                Reference = isReference ? method.GetCustomAttribute<ReferenceAttribute>(true).Url : null,
                Compression = !isCompression ? null : new
                {
                    Type = Enum.GetName(compression.Scheme.GetType(), compression.Scheme),
                    Level = Enum.GetName(compression.Level.GetType(), compression.Level)
                },
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

        #region Compression

        /// <summary>
        /// Gets a value indicating whether data should be compressed using custom compression engine.
        /// </summary>
        /// <value>
        ///   <c>true</c> if data should be compressed; otherwise, <c>false</c>.
        /// </value>
        private bool ShouldBeCompressed
        {
            get
            {
                var type = this.GetType();
                var method = this.GetCallerMethod(3);

                return CompressIgnoreAttribute.Instance.HasAttribute(method) || CompressIgnoreAttribute.Instance.HasAttribute(type) ? false :
                    CompressAttribute.Instance.HasAttribute(type, inherit: true) || CompressAttribute.Instance.HasAttribute(method, inherit: true);
            }
        }

        #endregion

        #region Helpers

        private MethodBase GetCallerMethod(int depth = 2)
        {
            var frame = new StackFrame(depth);
            return frame.GetMethod();
        }

        private static string GetDescription(MethodInfo methodInfo, ParameterInfo parameterInfo)
        {
            string result = null;

            if (!EnableExtendedDocumentation)
            {
                result = String.Format("{0} {1}", methodInfo, parameterInfo);
            }
            else
            {
                var attributeMethod = methodInfo.GetCustomAttribute<DescriptionAttribute>(true);
                var attributeParam = parameterInfo != null
                    ? parameterInfo.GetCustomAttribute<DescriptionAttribute>(true)
                    : null;

                if (attributeParam != null)
                {
                    return attributeParam.Description;
                }

                if (attributeMethod != null)
                {
                    return attributeMethod.Description;
                }

                try
                {
                    var controller =
                        XmlDocumentation.Documentation.Controllers.FirstOrDefault(
                            c => c.Caption.Equals(methodInfo.DeclaringType.Name));

                    if (controller != null)
                    {
                        var method = controller.Methods.FirstOrDefault(m => m.Caption.Equals(methodInfo.Name));

                        if (method != null)
                        {
                            if (parameterInfo == null)
                            {
                                result = method.Summary != null ? method.Summary.Value : null;
                            }
                            else
                            {
                                var param = method.Params.FirstOrDefault(p => p.Name.Equals(parameterInfo.Name));

                                if (param != null)
                                {
                                    result = param.Value;
                                }
                            }
                        }
                    }
                }
                catch
                {
                }
            }

            result = String.IsNullOrEmpty(result) ? String.Empty : result.Trim();

            return result;
        }

        private static void BuildCompressionInfo(Result result, object obj, Type type, MethodBase callerMethod)
        {
            CompressAttribute compression = null;
            var native = type.GetCustomAttribute<CompressNativeAttribute>(false);
            native = native ?? type.GetCustomAttribute<CompressNativeAttribute>(true);
            compression = type.GetCustomAttribute<CompressAttribute>(inherit: true);
            compression = compression ?? callerMethod.GetCustomAttribute<CompressAttribute>(inherit: true);
            if (compression != null)
            {
                result.Data = compression.CompressData(result.Data);
                result.Compression = new
                {
                    Type = Enum.GetName(compression.Scheme.GetType(), compression.Scheme),
                    Level = Enum.GetName(compression.Level.GetType(), compression.Level),
                    Ratio = ((float)result.Data.Length / (float)Serialize(obj).Length).ToString(),
                    ExecutingTime = compression.Time,
                    Native = native == null ? null : new
                    {
                        Type = Enum.GetName(native.PreferredEncoding.GetType(), native.PreferredEncoding),
                        Lavel = Enum.GetName(native.Level.GetType(), native.Level)
                    }
                };
            }
        }

        #endregion
    }
}
