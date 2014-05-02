using System;
using System.Web;
using Campus.SDK;
using Core;

namespace Site.Authentication
{
    public partial class WebForm1 : SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {

                if ((Request.Cookies["Session"] != null) && (Request.Cookies["Session"].Value != "") && (Session["SaveIn"] != null) && (Convert.ToBoolean(Session["SaveIn"]) == true))
                {
                    Response.Redirect("Profile.aspx");
                }
                else
                {
                    User.Text = "Логін";
                    Pass.Attributes["type"] = "password";
                    Pass.Text = "Пароль";
                    SaveIn.Checked = false;
                }
            }
        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            
            var sessionId = client.Authenticate(User.Text, Pass.Text);

            Logger.Info(String.Format("SessionId: {0}", sessionId));

            if (!String.IsNullOrEmpty(client.SessionId))
            {
                if (SaveIn.Checked)
                {
                    var cookie = new HttpCookie("Session")
                    {
                        Value = Session.SessionID,
                        Expires = DateTime.Now.AddDays(1d)
                    };

                    Response.Cookies.Add(cookie);
                    Session["SaveIn"] = true;
                }
                else
                {
                    Session["SaveIn"] = false;
                }

                SessionId = client.SessionId;
                Session["UserLogin"] = User.Text;
                Session["UserPass"] = Pass.Text;

                Response.Redirect("Profile.aspx");
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('" + "Помилка при авторизації!!!" + "');</script>");
            }
        }

        protected void Cancel_Click(object sender, EventArgs e)
        {
            User.Text = "Логін";
            Pass.Attributes["type"] = "password";
            Pass.Text = "Пароль";
            SaveIn.Checked = false;
        }
    }

}