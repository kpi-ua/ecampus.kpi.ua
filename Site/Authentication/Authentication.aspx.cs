using System;
using System.Web;
using Core;

namespace Site.Authentication
{
    public partial class WebForm1 : SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {

                if ((Request.Cookies["Session"] != null) && (Request.Cookies["Session"].Value != "") && (Session["SaveIn"] != null) && (Convert.ToBoolean(Session["SaveIn"]) == true))
                {
                    Response.Redirect("Profile.aspx");
                }
                else
                {
                    User.Value = "Логін";
                    Pass.Attributes["type"] = "password";
                    Pass.Value = "Пароль";
                    remember_me_chkbx.Checked = false;
                }
            }
        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            client.Authenticate(User.Value, Pass.Value);

            if (!String.IsNullOrEmpty(client.SessionId))
            {
                if (remember_me_chkbx.Checked)
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
                Session["UserLogin"] = User.Value;
                Session["UserPass"] = Pass.Value;

                Response.Redirect("Profile.aspx");
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('" + "Помилка при авторизації!!!" + "');</script>");
                //Response.Redirect("/Authentication/Authentication.aspx");
                //Page.ClientScript.RegisterClientScriptBlock(typeof(Page), "SCRIPT", string.Format("alert('Помилка при авторизації!!!\\n')"), true);

            }
        }

    }

}