using System;
using System.Collections.Generic;
using System.IO;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using NLog;

namespace Core
{
    public class SitePage : Page
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

        protected bool SaveIn
        {
            get { return Session["SaveIn"] != null && Convert.ToBoolean(Session["SaveIn"]); }
            set { Session["SaveIn"] = value; }
        }

        protected String SessionId
        {
            get { return Session["UserData"] == null ? null : Session["UserData"].ToString(); }
            set { Session["UserData"] = value; }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var page = Path.GetFileName(Request.Url.AbsolutePath).ToLower();

            if (String.IsNullOrEmpty(SessionId) && page != "login.aspx")
            {
                Response.Redirect("~/Login.aspx");
            }
        }

        protected void CreateErrorMessage(HtmlGenericControl target)
        {
            target.Controls.Clear();
            var error = new HtmlGenericControl("h2");
            error.InnerText = "Помилка при завантаженні сторінки!!!";
            target.Controls.Add(error);
        }
    }
}
