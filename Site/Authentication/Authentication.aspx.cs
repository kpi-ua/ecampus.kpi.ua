using System;
using System.Collections.Generic;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;

namespace Site.Authentication
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        private const string domain = "localhost:55897";

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
                    User.Text = "Логін";
                    Pass.Attributes["type"] = "password";
                    Pass.Text = "Пароль";
                    SaveIn.Checked = false;
                }

            }


        }

        protected void Enter_Click(object sender, EventArgs e)
        {
            String req = String.Format("{0}User/Auth?login={1}&password={2}", Campus.SDK.Client.ApiEndpoint, User.Text, Pass.Text);

            Dictionary<string, string> respDictionary = GetJson(req);

            if (respDictionary.ContainsKey("Data"))
            {
                if (SaveIn.Checked)
                {
                    HttpCookie myCookie = new HttpCookie("Session");
                    myCookie.Value = Session.SessionID;
                    myCookie.Expires = DateTime.Now.AddDays(1d);
                    Response.Cookies.Add(myCookie);
                    Session["SaveIn"] = true;
                }
                else
                {
                    Session["SaveIn"] = false;
                }

                Session["UserData"] = respDictionary["Data"].ToString();
                Session["UserLogin"] = User.Text;
                Session["UserPass"] = Pass.Text;

                Response.Redirect("Profile.aspx");
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('" + "Помилка при авторизації!!!" + "');</script>");
                //Response.Redirect("/Authentication/Authentication.aspx");
                //Page.ClientScript.RegisterClientScriptBlock(typeof(Page), "SCRIPT", string.Format("alert('Помилка при авторизації!!!\\n')"), true);

            }
        }

        protected void Cancel_Click(object sender, EventArgs e)
        {
            User.Text = "Логін";
            Pass.Attributes["type"] = "password";
            Pass.Text = "Пароль";
            SaveIn.Checked = false;
        }

        public Dictionary<string, string> GetJson(String req)
        {
            try
            {
                WebClient client = new WebClient();

                //WebProxy p = new WebProxy("10.13.100.13:3128", true);
                //p.Credentials = new NetworkCredential("kbis_user", "kbis13");
                //WebRequest.DefaultWebProxy = p;
                //client.Proxy = p;

                var json = client.DownloadString(req);

                var serializer = new JavaScriptSerializer();

                return serializer.Deserialize<Dictionary<string, string>>(json);

            }
            catch (Exception ex)
            {
                return new Dictionary<string, string>();
            }

        }


    }

}