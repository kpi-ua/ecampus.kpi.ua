using System;
using System.IO;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using NLog;

namespace Core
{
    public class SitePage : Page
    {
        protected Logger Logger = LogManager.GetCurrentClassLogger();

        private CampusClient _campusClient;

        protected CampusClient CampusClient
        {
            get { return _campusClient ?? (_campusClient = new CampusClient()); }
        }

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

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var page = Path.GetFileName(Request.Url.AbsolutePath).ToLower();

            if (String.IsNullOrEmpty(SessionId) && page != "authentication.aspx")
            {
                Response.Redirect("~/Authentication/Authentication.aspx");
            }
        }

        public void CreateErrorMessage(HtmlGenericControl target)
        {
            target.Controls.Clear();
            var error = new HtmlGenericControl("h2");
            error.InnerText = "Помилка при завантаженні сторінки!!!";
            target.Controls.Add(error);
        }
    }
}
