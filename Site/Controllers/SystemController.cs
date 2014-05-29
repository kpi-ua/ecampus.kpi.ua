using System;
using System.Web;
using System.Web.Security;
using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class SystemController : SiteController
    {
        public ActionResult Login(Credential credential)
        {
            if (credential.IsNotEmpty)
            {
                var sessionId = CampusClient.Authenticate(credential.Login, credential.Password);

                if (!String.IsNullOrEmpty(sessionId))
                {
                    SessionId = sessionId;
                    UserLogin = credential.Login;
                    UserPassword = credential.Password;
                    FormsAuthentication.SetAuthCookie(credential.Login, true);
                    return Redirect("~/Default.aspx");
                }

                return View(credential);
            }

            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();
            HttpContext.Response.Cookies.Clear();
            return Redirect("~/login");
        }

        public ActionResult Support()
        {
            return View();
        }

    }
}