using System.Web.Mvc;

namespace Example.Controllers
{
    public class HomeController : Campus.Core.ApiController
    {
        // GET: Home
        public ActionResult Index()
        {
            return Result("Hello! All example methods are in Example controller.");
        }
    }
}