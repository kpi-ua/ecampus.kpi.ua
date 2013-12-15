using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace WebApplication
{
    public partial class Inner : System.Web.UI.MasterPage
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

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {
                if (!UserAuthorized)
                {
                    Response.Redirect("/Authentication/Authentication.aspx");
                }
                else
                {
                    ExitLink.PostBackUrl = Request.Url.AbsoluteUri;

                    var url = Campus.SDK.Client.BuildUrl("User", "GetCurrentUser") + "?sessionId=" + SessionId;

                    var result = new Campus.SDK.Client().Get(url);
                    var serializer = new JavaScriptSerializer();
                    var json = result.Data.ToString();
                    var data = serializer.Deserialize<Dictionary<string, object>>(json);

                    UserName.Text += data["FullName"];
                }

            }
        }

        protected void ExitLink_Click(object sender, EventArgs e)
        {
            if (Convert.ToBoolean(Session["SaveIn"]))
            {
                Response.Cookies["Session"].Value = null;
            }

            Response.Redirect("/Authentication/Authentication.aspx");
        }
    }
}