using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Example.Controllers
{
    public class HomeController : Campus.Core.ApiController
    {
        // GET: Home
        public ActionResult Index()
        {
            return base.Introspect();
        }

        public ActionResult Test()
        {
            return Content("It works!");
        }
    }
}