using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Campus.Core.Attributes
{
    public enum CompressionScheme
    {
        Gzip,
        Deflate,
        Identity
    }

    /// <summary>
    /// Enables data output compression
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class CompressAttribute : AbstractAttribute
    {
        private static CompressAttribute _instance;



        public static CompressAttribute Instance
        {
            get { return _instance ?? (_instance = new CompressAttribute()); }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CompressAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        /// <param name="scheme">The scheme. (Deflate does not supported in JS)</param>
        public CompressAttribute(CompressionLevel level = CompressionLevel.Fastest, CompressionScheme scheme = CompressionScheme.Gzip)
        {
            Level = level; Scheme = scheme;
        }

        /// <summary>
        /// Gets the compression level.
        /// </summary>
        /// <value>
        /// The level.
        /// </value>
        public CompressionLevel Level { get; private set; }
        /// <summary>
        /// Gets the compression time.
        /// </summary>
        /// <value>
        /// The time.
        /// </value>
        public string Time { get; private set; }

        /// <summary>
        /// Gets the compression scheme.
        /// </summary>
        /// <value>
        /// The scheme.
        /// </value>
        public CompressionScheme Scheme { get; private set; }

        /// <summary>
        /// Compresses the data.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <returns></returns>
        public dynamic CompressData(string data)
        {
            var timer = new Stopwatch();
            timer.Start();


            var result = Zip(data, Level);

            timer.Stop();

            Time = timer.Elapsed.TotalSeconds.ToString("0.000000000");

            return result;
        }

        /// <summary>
        /// Compresses the data.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <returns></returns>
        public dynamic CompressData(object obj)
        {
            return CompressData(Serialize(obj));
        }

        private static void CopyTo(Stream src, Stream dest)
        {
            byte[] bytes = new byte[4096];

            int cnt;

            while ((cnt = src.Read(bytes, 0, bytes.Length)) != 0)
            {
                dest.Write(bytes, 0, cnt);
            }
        }

        private byte[] Zip(string str, CompressionLevel level)
        {
            var bytes = Encoding.UTF8.GetBytes(str);

            using (var msi = new MemoryStream(bytes))
            {
                using (var mso = new MemoryStream())
                {
                    if (Scheme == CompressionScheme.Gzip)
                    {
                        using (var gs = new GZipStream(mso, level))
                        {
                            CopyTo(msi, gs);
                        }
                    }
                    else if (Scheme == CompressionScheme.Deflate)
                    {
                        using (var gs = new DeflateStream(mso, level))
                        {
                            CopyTo(msi, gs);
                        }
                    }

                    return mso.ToArray();
                }
            }
        }

        private string Serialize(object result, bool useJavaScriptStyleCamelcase = true)
        {
            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = Formatting.Indented,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            };

            if (useJavaScriptStyleCamelcase)
            {
                settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            }

            var json = JsonConvert.SerializeObject(result, settings);
            return json;
        }
    }

    /// <summary>
    /// Indicates that target should not be compressed with CompressAttribute
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class CompressIgnoreAttribute : AbstractAttribute
    {

        private static CompressIgnoreAttribute _instance;

        public static CompressIgnoreAttribute Instance
        {
            get { return _instance ?? (_instance = new CompressIgnoreAttribute()); }
        }
    }

    /// <summary>
    /// Enables browser native compression
    /// </summary>
    /// <remarks>Work only with browsers</remarks>
    [AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class CompressNativeAttribute : ActionFilterAttribute
    {
        private readonly CompressionLevel _level;

        /// <summary>
        /// Initializes a new instance of the <see cref="CompressNativeAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        public CompressNativeAttribute(CompressionLevel level = CompressionLevel.Fastest)
            : base()
        {
            _level = level;
        }

        /// <summary>
        /// Gets the compression level.
        /// </summary>
        /// <value>
        /// The level.
        /// </value>
        public CompressionLevel Level { get { return _level; } }

        /// <summary>
        /// Gets the preferred encoding.
        /// </summary>
        /// <value>
        /// The preferred encoding.
        /// </value>
        public CompressionScheme PreferredEncoding { get; private set; }

        /// <summary>
        /// Called by the ASP.NET MVC framework before the action method executes.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!ApiController.AllowCompression)
            {
                base.OnActionExecuting(filterContext);
                return;
            }

            // Analyze the list of acceptable encodings
            var preferredEncoding = GetPreferredEncoding(filterContext.HttpContext.Request);
            // Compress the response accordingly
            var response = filterContext.HttpContext.Response;
            response.AppendHeader("Content-encoding", preferredEncoding.ToString());

            if (preferredEncoding == CompressionScheme.Gzip)
            {
                response.Filter = new GZipStream(response.Filter, _level);
            }

            if (preferredEncoding == CompressionScheme.Deflate)
            {
                response.Filter = new DeflateStream(response.Filter, _level);
            }
        }

        private static CompressionScheme GetPreferredEncoding(HttpRequestBase request)
        {
            var acceptableEncoding = request.Headers["Accept-Encoding"];

            // Get the preferred encoding format 
            if (acceptableEncoding.Contains("gzip"))
            {
                return CompressionScheme.Gzip;
            }

            if (acceptableEncoding.Contains("deflate"))
            {
                return CompressionScheme.Deflate;
            }

            return CompressionScheme.Identity;
        }
    }
}
