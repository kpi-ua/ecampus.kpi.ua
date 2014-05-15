using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Links()
        {
            return View(Link.GetList());
        }
    }
}