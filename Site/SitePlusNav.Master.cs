using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using Core;

namespace Site
{
    public partial class SitePlusNav : SiteMasterPage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

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

                    var campusClient = new CampusClient();

                    var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + sessionId);
                    var serializer = new JavaScriptSerializer();
                    var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                    var Data = (Dictionary<string, object>)respDictionary["Data"];

                    UserName.Text += Data["FullName"];

                    form1.Controls.Add(CreateHiddenInput("uhidden", Data["UserAccountId"].ToString()));
                    form1.Controls.Add(CreateHiddenInput("hidden", SessionId.ToString()));
                }

            }
            catch (Exception ex)
            {

                UserName.Text = "Ошибка при загрузке страницы!!!";
            }
        }

        protected void ExitLink_Click(object sender, EventArgs e)
        {
            if (Convert.ToBoolean(Session["SaveIn"]) == true)
            {
                SessionId = String.Empty;
                Response.Cookies["Session"].Value = null;
            }

            Response.Redirect("/Authentication/Authentication.aspx");
        }

        private HtmlGenericControl CreateHiddenInput(string id, string value)
        {
            HtmlGenericControl hiddenField = new HtmlGenericControl("input");

            hiddenField.Attributes.Add("id", id);

            hiddenField.Attributes.Add("type", "hidden");

            hiddenField.Attributes.Add("value", value);

            return hiddenField;
        }
    }
}