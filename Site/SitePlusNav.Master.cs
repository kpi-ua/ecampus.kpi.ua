using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;

namespace Site
{
    public partial class SitePlusNav : System.Web.UI.MasterPage
    {
        public event EventHandler contentCallEvent;

        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!Page.IsPostBack)
            //{
                try
                {

                    if ((Convert.ToBoolean(Session["SaveIn"]) == true) && ((Request.Cookies["Session"] == null) || (Request.Cookies["Session"].Value == "")))
                    {

                        Response.Redirect("/Authentication/Authentication.aspx");

                    }
                    else
                    {
                        UserName.Text = "";

                        ExitLink.PostBackUrl = Request.Url.AbsoluteUri.ToString();
                        string sessionId = Session["UserData"].ToString();

                        WebClient client = new WebClient();
                        client.Encoding = System.Text.Encoding.UTF8;
                        var json = client.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + sessionId);
                        var serializer = new JavaScriptSerializer();
                        Dictionary<string, object> respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                        Dictionary<string, object> Data = (Dictionary<string, object>)respDictionary["Data"];
          
                        UserName.Text += Data["FullName"];

                        HtmlGenericControl hiddenField = new HtmlGenericControl("input");

                        hiddenField.Attributes.Add("id", "uhidden");

                        hiddenField.Attributes.Add("type", "hidden");

                        hiddenField.Attributes.Add("value", Data["UserAccountId"].ToString());

                        form1.Controls.Add(hiddenField);
                    }

                }
                catch (Exception ex)
                {
                    UserName.Text = "Ошибка при загрузке страницы!!!";
                }
            //}
        }

        protected void ExitLink_Click(object sender, EventArgs e)
        {
            if (Convert.ToBoolean(Session["SaveIn"]) == true)
            {
                Response.Cookies["Session"].Value = null;
            }
            Response.Redirect("/Authentication/Authentication.aspx");
        }
    }
}