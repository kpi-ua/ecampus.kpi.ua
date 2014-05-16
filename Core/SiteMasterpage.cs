using NLog;
using System;
using System.Web.UI;

namespace Core
{
    public class SiteMasterPage : MasterPage
    {
        private CampusClient _campusClient;

        protected CampusClient CampusClient
        {
            get { return _campusClient ?? (_campusClient = new CampusClient()); }
        }

        protected bool SaveIn
        {
            get { return Convert.ToBoolean(Session["SaveIn"]); }
            set { Session["SaveIn"] = value; }
        }

        protected String SessionId
        {
            get { return Session["UserData"] == null ? null : Session["UserData"].ToString(); }
            set { Session["UserData"] = value; }
        }

        protected Logger Logger = LogManager.GetCurrentClassLogger();
    }
}
