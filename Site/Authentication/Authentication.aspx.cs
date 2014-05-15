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
                if ((Request.Cookies["Session"] != null)
                    && (Request.Cookies["Session"].Value != "")
                    && (Session["SaveIn"] != null)
                    && Convert.ToBoolean(Session["SaveIn"]))
                {
                    Response.Redirect("Profile.aspx");
                }
                else
                {
                    txPass.Attributes["type"] = "password";
                    remember_me.Checked = false;
                }
            }
        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            client.Authenticate(txUser.Text, txPass.Text);

            if (!String.IsNullOrEmpty(client.SessionId))
            {
                if (remember_me.Checked)
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
                Session["UserLogin"] = txUser.Text;
                Session["UserPass"] = txPass.Text;

                Response.Redirect("Profile.aspx");
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('" + "Помилка при авторизації!!!" + "');</script>");
            }
        }

    }

}