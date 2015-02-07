using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Campus.Common;

namespace Core
{
    public class SiteController : Controller
    {
        private CampusClient _campusClient;

        protected CampusClient CampusClient
        {
            get { return _campusClient ?? (_campusClient = new CampusClient()); }
        }

        protected User CurrentUser
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

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            ViewBag.CurrentUser = CurrentUser;

            base.OnActionExecuted(filterContext);
        }
    }
}
