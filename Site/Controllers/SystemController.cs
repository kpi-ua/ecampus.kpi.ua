using System;
using System.Web;
using Core;
using System.Web.Mvc;

namespace Site.Controllers
{
    public class SystemController : SiteController
    {
        // GET: System
        public ActionResult Login(Credential credential)
        {
            if (credential.IsNotEmpty)
            {
                var sessionId = CampusClient.Authenticate(credential.Login, credential.Password);

                if (!String.IsNullOrEmpty(sessionId))
                {
                    SessionId = sessionId;
                    SaveIn = credential.RememberMe;
                    UserLogin = credential.Login;
                    UserPassword = credential.Password;

                    if (SaveIn)
                    {
                        Response.Cookies.Add(new HttpCookie("Session")
                        {
                            Value = Session.SessionID,
                            Expires = DateTime.Now.AddDays(1d)
                        });
                    }

                    return Redirect("~/Default.aspx");
                }

                return View(credential);
            }

            return View();
        }

        public ActionResult Logout()
        {
            Response.Cookies["Session"].Value = null;
            return Redirect("~/login");
        }

        public ActionResult Support()
        {
            return View();
        }

    }
}