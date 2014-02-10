using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;
using NLog;

namespace Core
{
    public class SiteMasterPage : MasterPage
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

        protected Logger Logger = LogManager.GetCurrentClassLogger();
    }
}
