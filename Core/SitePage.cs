using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using Campus.Common;

namespace Core
{
    public class SitePage : Page
    {
        private CampusClient _campusClient;

        protected CampusClient CampusClient
        {
            get { return _campusClient ?? (_campusClient = new CampusClient()); }
        }

        public User CurrentUser
        {
            get
            {
                var user = Session["current-user"] as Campus.Common.User;

                if (user == null)
                {
                    user = CampusClient.GetUser(SessionId);
                    Session["current-user"] = user;
                }

                return user;
            }
        }
        
        public String SessionId
        {
            get { return Session["UserData"] == null ? null : Session["UserData"].ToString(); }
            set { Session["UserData"] = value; }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (String.IsNullOrEmpty(SessionId) || !Context.User.Identity.IsAuthenticated)
            {
                Response.Redirect("~/login");
            }

            CampusClient.SessionId = SessionId;
        }
    }
}
