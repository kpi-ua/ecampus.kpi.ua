using Core;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Site.Controllers
{
    public class SystemController : SiteController
    {
        public ActionResult Login(Credential credential)
        {
            if (credential.IsNotEmpty)
            {
                ClearSessionData();

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
            return Redirect("~/login");
        }

        private void ClearSessionData()
        {
            Session.Clear();
            HttpContext.Response.Cookies.Clear();   
        }

        public ActionResult Support()
        {
            return View();
        }

    }
}