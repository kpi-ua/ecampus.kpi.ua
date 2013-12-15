using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;

namespace Core
{
    public class WebPage : Page
    {
        protected string SessionId
        {
            get
            {
                if (Session["SessionId"] != null)
                {
                    return Session["SessionId"].ToString();
                }

                return String.Empty;
            }
            set
            {
                Session["SessionId"] = value;
            }
        }

        protected bool UserAuthorized
        {
            get { return !String.IsNullOrEmpty(SessionId); }
        }
    }
}
