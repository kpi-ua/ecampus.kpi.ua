using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.EIR.IrGroup
{
    public partial class NewIrGroupPage : Core.SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void save_Click(object sender, EventArgs e)
        {

            
            if (SessionId != null)
            {

                if (name.Text != "")
                {
                    var client = new Campus.SDK.Client();
                    var groupName = name.Text.ToString();
                    var description = short_description.Text.ToString();
                    var url = Campus.SDK.Client.BuildUrl("IrGroup", "CreatePrivateIrGroup", new { SessionId, groupName, description });
                    var result = client.Get(url);
                    
                    Response.Redirect("Default.aspx");
                }
                else
                {
                    Response.Write("<script type='text/javascript'>alert('" + "Будь ласка, заповніть усі необхідні поля!" + "');</script>");
                }
            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }

        }


        protected void feature_type_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrKind");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }
    }
}