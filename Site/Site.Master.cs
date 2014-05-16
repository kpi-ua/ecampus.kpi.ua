using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using Core;

namespace Site
{
    public partial class SiteMaster : SiteMasterPage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            try
            {
                if (SaveIn && ((Request.Cookies["Session"] == null) || (Request.Cookies["Session"].Value == "")))
                {
                    Response.Redirect("~/Login.aspx");
                }
                else
                {
                    UserName.Text = "";

                    ExitLink.PostBackUrl = Request.Url.AbsoluteUri;
                    
                    var url = Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId;
                    var json = CampusClient.DownloadString(url);

                    var serializer = new JavaScriptSerializer();
                    var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                    var data = (Dictionary<string, object>)respDictionary["Data"];

                    UserName.Text += data["FullName"];

                    var hiddenField = new HtmlGenericControl("input");
                    hiddenField.Attributes.Add("id", "uhidden");
                    hiddenField.Attributes.Add("type", "hidden");
                    hiddenField.Attributes.Add("value", data["UserAccountId"].ToString());

                    form.Controls.Add(hiddenField);
                }

            }
            catch (Exception ex)
            {
                UserName.Text = "Ошибка при загрузке страницы!!!";
            }
        }

        protected void ExitLink_Click(object sender, EventArgs e)
        {
            if (SaveIn)
            {
                Response.Cookies["Session"].Value = null;
            }

            Response.Redirect("~/Login.aspx");
        }
    }
}