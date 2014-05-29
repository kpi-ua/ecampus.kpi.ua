using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Core
{
    public class SiteController : Controller
    {
        private CampusClient _campusClient;

        protected CampusClient CampusClient
        {
            get { return _campusClient ?? (_campusClient = new CampusClient()); }
        }

        protected Dictionary<string, Permission> Permissions
        {
            get
            {
                if (Session["UserPremissions"] == null)
                {
                    Session["UserPremissions"] = new Dictionary<string, Permission>();
                }

                return Session["UserPremissions"] as Dictionary<string, Permission>;
            }
            set
            {
                Session["UserPremissions"] = value;
            }
        }

        protected Campus.Common.User CurrentUser
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
        
        protected String SessionId
        {
            get { return Session["UserData"] == null ? null : Session["UserData"].ToString(); }
            set { Session["UserData"] = value; }
        }

        protected String UserLogin
        {
            get { return Session["UserLogin"] == null ? null : Session["UserLogin"].ToString(); }
            set { Session["UserLogin"] = value; }
        }

        protected String UserPassword
        {
            get { return Session["UserPassword"] == null ? null : Session["UserPassword"].ToString(); }
            set { Session["UserPassword"] = value; }
        }
    }
}
