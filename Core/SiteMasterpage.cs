using System;
using System.Web.UI;

namespace Core
{
    public class SiteMasterPage : MasterPage
    {
        protected Campus.Common.User CurrentUser
        {
            get
            {
                var user = Session["current-user"] as Campus.Common.User;

                if (user == null)
                {
                    var campusClient = new CampusClient();
                    user = campusClient.GetUser(SessionId);
                    Session["current-user"] = user;
                }

                return user;
            }
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
    }
}
