using Core;
using System;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;

namespace Site.Controllers
{
    public class SystemController : SiteController
    {
        public ActionResult Login(NetworkCredential credential)
        {
            if (!IsEmpty(credential))
            {
                var sessionId = CampusClient.Authenticate(credential.UserName, credential.Password);

                if (!String.IsNullOrEmpty(sessionId))
                {
                    SessionId = sessionId;

                    FormsAuthentication.SetAuthCookie(credential.UserName, true);
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
            FormsAuthentication.SignOut();
            return Redirect("~/login");
        }

        private static bool IsEmpty(NetworkCredential credential)
        {
            return String.IsNullOrEmpty(credential.Password)
                   && String.IsNullOrEmpty(credential.UserName);
        }
    }
}