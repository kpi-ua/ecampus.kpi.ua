using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Campus.Core.Attributes
{
    /// <summary>
    /// Enables data output compression
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class CompressAttribute : AbstractAttribute
    {
        private static CompressAttribute _instance = null;        

        public enum CompressionScheme
        {
            Gzip,
            Deflate,
            Identity
        }

        /// <summary>
        /// <list type="CompressLevel">
        /// <para>Fastest - best speed but worst compression</para>
        /// <para>Smallest - best but slow compression</para>             
        /// </list>
        /// </summary>
        public enum CompressLevel
        {
            Fastest,
            Smallest,            
        }

        public static CompressAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new CompressAttribute();
                return _instance;
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CompressAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        /// <param name="scheme">The scheme. (Deflate does not supported in JS)</param>
        public CompressAttribute(CompressLevel level = CompressLevel.Fastest, CompressionScheme scheme = CompressionScheme.Gzip)
        {
            Level = level; Scheme = scheme;
        }        

        /// <summary>
        /// Gets the compression level.
        /// </summary>
        /// <value>
        /// The level.
        /// </value>
        public CompressLevel Level { get; private set; }
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

            dynamic result = null;
            var gz = Zip(data, (Level == CompressLevel.Fastest) ? CompressionLevel.Fastest : CompressionLevel.Optimal);
            if (Level == CompressLevel.Smallest)
            {                                
                result = Base64Encode(gz);
            }
            else
            {
                result = gz;
            }
            
            timer.Stop();
            Time = timer.Elapsed.TotalSeconds.ToString("0.000000000");
            if (Time.EndsWith("0")) Time = Time + "9";

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

        private string Base64Encode(string data)
        {
            var dataBytes = System.Text.Encoding.UTF8.GetBytes(data);
            return System.Convert.ToBase64String(dataBytes);
        }

        private string Base64Encode(byte[] data)
        {            
            return System.Convert.ToBase64String(data);
        }

        private string Serialize(object result, bool UseJavaScriptStyleCamelcase = true)
        {            
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
    }

    /// <summary>
    /// Indicates that target should not be compressed with CompressAttribute
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class CompressIgnoreAttribute : AbstractAttribute
    {
        public CompressIgnoreAttribute()
        {

        }

        private static CompressIgnoreAttribute _instance;

        public static CompressIgnoreAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new CompressIgnoreAttribute();
                return _instance;
            }
        }
    }

    /// <summary>
    /// Enables browser native compression
    /// </summary>
    /// <remarks>Work only with browsers</remarks>
    [AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class CompressNativeAttribute : ActionFilterAttribute
    {        
        private CompressionLevel _level;

        /// <summary>
        /// Initializes a new instance of the <see cref="CompressNativeAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        /// <param name="compressOutput">if set to <c>true</c> [compress output].</param>
        public CompressNativeAttribute(CompressionLevel level = CompressionLevel.Fastest)
            : base()
        {
            _level = level;
        }

        public enum CompressionScheme
        {
            Gzip,
            Deflate,
            Identity
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
            var PreferredEncoding = GetPreferredEncoding(filterContext.HttpContext.Request);
            // Compress the response accordingly
            var response = filterContext.HttpContext.Response;
            response.AppendHeader("Content-encoding", PreferredEncoding.ToString());
            if (PreferredEncoding == CompressionScheme.Gzip)
            {
                response.Filter = new GZipStream(response.Filter, _level);
            }
            if (PreferredEncoding == CompressionScheme.Deflate)
            {
                response.Filter = new DeflateStream(response.Filter, _level);
            }
            return;
        }
        
        private static CompressionScheme GetPreferredEncoding(HttpRequestBase request)
        {
            var acceptableEncoding = request.Headers["Accept-Encoding"];
            //acceptableEncoding = SortEncodings(acceptableEncoding);

            // Get the preferred encoding format 
            if (acceptableEncoding.Contains("gzip"))
                return CompressionScheme.Gzip;
            if (acceptableEncoding.Contains("deflate"))
                return CompressionScheme.Deflate;
            return CompressionScheme.Identity;
        }        
    }
}
