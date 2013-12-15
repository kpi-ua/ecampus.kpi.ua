using System;
using System.Web;

namespace WebApplication.Authentication
{
    public partial class WebForm1 : Core.WebPage
    {
        private const string domain = "localhost:55897";

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {
                if (UserAuthorized)
                {
                    Response.Redirect("Profile.aspx");
                }
                else
                {
                    ResetLoginForm();
                }
            }
        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            
            try
            {
                SessionId = client.Authenticate(User.Text, Pass.Text);
            }
            catch (Exception ex)
            {
                SessionId = String.Empty;
            }
            if (!String.IsNullOrEmpty(SessionId))
            {
                var cookie = new HttpCookie("Session")
                {
                    Value = Session.SessionID,
                    Expires = DateTime.Now.AddDays(1d)
                };

                Response.Cookies.Add(cookie);
                Session["SaveIn"] = SaveIn.Checked;
                Response.Redirect("Profile.aspx");
            }
            else
            {
                //Response.Redirect("http://" + domain + "/RNP");
            }
        }

        protected void Cancel_Click(object sender, EventArgs e)
        {
            ResetLoginForm();
        }

        private void ResetLoginForm()
        {
            User.Text = "Логін";
            Pass.Attributes["type"] = "password";
            Pass.Text = "Пароль";
            SaveIn.Checked = false;
        }
    }
}