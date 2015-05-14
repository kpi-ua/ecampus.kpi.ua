using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.Mvc;
using PagedList;

namespace Example.Controllers
{
    /// <summary>
    /// Test controller description
    /// </summary>
    public class ExampleController : Campus.Core.ApiController
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

        /// <summary>
        /// Main test method
        /// </summary>
        /// <returns></returns>
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
        /// Test2s the specified some value.
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns>JSON</returns>
        public ActionResult GetList()
        {
            var list = new List<String>
            {
                "One",
                "Two",
                "Thre",
                "Four"
            };

            return Result(list.ToPagedList(1, 4));
        }

        /// <summary>
        /// Test3s the specified some value will be overridden.
        /// </summary>
        /// <param name="someValue">Some value.</param>
        /// <returns></returns>
        [Description("Descrption attr test")]
        //[Reference("http://someurl.com")]
        public ActionResult Test3([Description("testc description for params")]string someValue = "test")
        {
            return Result(someValue);
        }
    }
}