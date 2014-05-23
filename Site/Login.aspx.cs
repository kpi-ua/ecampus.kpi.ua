using System;
using System.Web;
using Core;

namespace Site
{
    public partial class Login : SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {
                if ((Request.Cookies["Session"] != null) && (Request.Cookies["Session"].Value != "") && SaveIn)
                {
                    RedirectToProfile();
                }
                else
                {
                    txPass.Attributes["type"] = "password";
                    remember_me.Checked = false;
                }
            }
        }

        private void RedirectToProfile()
        {
            Response.Redirect("~/Default.aspx");
        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            client.Authenticate(txUser.Text, txPass.Text);

            if (!String.IsNullOrEmpty(client.SessionId))
            {
                SaveIn = false;

                if (remember_me.Checked)
                {
                    var cookie = new HttpCookie("Session")
                    {
                        Value = Session.SessionID,
                        Expires = DateTime.Now.AddDays(1d)
                    };

                    Response.Cookies.Add(cookie);
                    SaveIn = true;
                }

                SessionId = client.SessionId;
                Session["UserLogin"] = txUser.Text;
                Session["UserPass"] = txPass.Text;

                RedirectToProfile();
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('" + "Помилка при авторизації!!!" + "');</script>");
            }
        }

    }

}