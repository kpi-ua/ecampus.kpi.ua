using System;
using System.IO;
using System.Web.UI;
using NLog;

namespace Core
{
    public class SitePage : Page
    {
        protected Logger Logger = LogManager.GetCurrentClassLogger();

        protected String SessionId
        {
            get
            {
                return Session["UserData"] == null ? null : Session["UserData"].ToString();
            }
            set
            {
                Session["UserData"] = value;
            }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var page = Path.GetFileName(Request.Url.AbsolutePath).ToLower();

            if (String.IsNullOrEmpty(SessionId) && page != "authentication.aspx")
            {
                Response.Redirect("~/Authentication/Authentication.aspx");
            }
        }
    }
}
