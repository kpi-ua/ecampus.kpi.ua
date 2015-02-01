using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class HomeController : SiteController
    {
        //[OutputCache(Duration = Core.Configuration.OutputCacheDuration, VaryByParam = "*")]
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Support()
        {
            return View();
        }
    }
}