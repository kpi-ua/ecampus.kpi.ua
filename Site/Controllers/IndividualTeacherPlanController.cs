using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    [Authorize]
    public class IndividualTeacherPlanController : SiteController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}