using Campus.Core.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Example.Controllers
{
    /// <summary>
    /// Test controller description
    /// </summary>
    public class HomeController : Campus.Core.ApiController
    {
        // GET: Home        
        /// <summary>
        /// Indexes this instance.
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return base.Introspect();
        }
        
        public ActionResult Test()
        {
            return Content("It works!");
        }

        /// <summary>
        /// Test2s the specified some value.
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns>JSON</returns>
        public ActionResult Test2(string someValue = "test")
        {
            return Result(someValue);
        }

        /// <summary>
        /// Test3s the specified some value will be overridden.
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns></returns>
        [Description("Descrption attr test")]
        [Reference("http://someurl.com")]
        public ActionResult Test3([Description("testc description for params")]string someValue = "test")
        {
            return Result(someValue);
        }

        /// <summary>
        /// Test2s the specified some value. (Compression disabled on the API level)
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns>JSON</returns>
        [Campus.Core.Attributes.Compress]
        public ActionResult TestCompress(string someValue = "test")
        {
            Campus.Core.ApiController.AllowCompression = false;
            return Result(someValue);
        }

        /// <summary>
        /// Test2s the specified some value.
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns>JSON</returns>
        [Campus.Core.Attributes.Compress]
        public ActionResult TestCompress2(string someValue = "test")
        {
            Campus.Core.ApiController.AllowCompression = true;
            return Result(someValue);
        }
    }
}