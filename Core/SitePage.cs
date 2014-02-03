using System;
using System.Web.UI;

namespace Core
{
    public class SitePage : Page
    {
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
    }
}
