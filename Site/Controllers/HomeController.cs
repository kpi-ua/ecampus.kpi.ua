using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class HomeController : SiteController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}