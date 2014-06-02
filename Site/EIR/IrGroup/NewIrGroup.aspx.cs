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
        private int irGroupId;

        protected void Page_Load(object sender, EventArgs e)
        {
            //TODO debuging staff - delete!!!!!!!
            //var client = new Campus.SDK.Client();
            //client.Authenticate("123", "123");
            //SessionId = client.SessionId;

            switch (Request.QueryString["type"])
            {
                case "edit":
                    {
                        page_title.InnerText = "Редагувати ЕІР";
                        deleteBTN.Visible = true;
                        irGroupId = Convert.ToInt32(Request.QueryString["irGroupId"]);
                        FillValues();
                        break;
                    }
            }

            UpdatePrivatePanel();
        }


        private void FillValues()
        {
            if (!Page.IsPostBack)
            {
                var client = new Campus.SDK.Client();
                var serializer = new JavaScriptSerializer();
                var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "IrGroup/GetIrGroupData?sessionId=" + SessionId + "&irGroupId=" + irGroupId);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var data = (Dictionary<string, object>)respDictionary["Data"];

                name.Text = data["Name"].ToString();
                if (data["Description"] != null)
                {
                    short_description.Text = data["Description"].ToString();
                }
                if (data["DcSubdivisionId"] != null)
                {
                    var dcSubdivisionId = Convert.ToInt32(data["DcSubdivisionId"]);
                    is_public.SelectedValue = "public";
                    UpdatePrivatePanel();
                    subdivisionList.SelectedValue = dcSubdivisionId.ToString();
                }
            }
        }

        protected void save_Click(object sender, EventArgs e)
        {


            if (SessionId != null)
            {

                if (name.Text != "")
                {
                    var client = new Campus.SDK.Client();
                    var groupName = name.Text;
                    var description = short_description.Text;
                    int subdivisionId;
                    string url;
                    
                    if ("edit" == Request.QueryString["type"])
                    {
                        if (is_public.SelectedValue == "private")
                        {
                            subdivisionId = -1; 
                        }
                        else
                        {
                            subdivisionId = Convert.ToInt32(subdivisionList.SelectedValue);
                        }
                        url = Campus.SDK.Client.BuildUrl("IrGroup", "UpdateIrGroup", new { SessionId, irGroupId ,subdivisionId, groupName, description });
                    }
                    else
                    {
                        if (is_public.SelectedValue == "private")
                        {
                            url = Campus.SDK.Client.BuildUrl("IrGroup", "CreatePrivateIrGroup", new { SessionId, groupName, description });
                        }
                        else
                        {
                            subdivisionId = Convert.ToInt32(subdivisionList.SelectedValue);
                            url = Campus.SDK.Client.BuildUrl("IrGroup", "CreateIrGroup", new { SessionId, subdivisionId, groupName, description });
                        }
                    }

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


        protected void is_public_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            UpdatePrivatePanel();
        }


        protected void delete_Click(object sender, EventArgs e)
        {
            if (SessionId != null)
            {
                    var client = new Campus.SDK.Client();
                    var url = Campus.SDK.Client.BuildUrl("IrGroup", "DeleteIrGroup", new { SessionId, irGroupId});
                    var result = client.Get(url);
                    Response.Redirect("Default.aspx");

            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }
        }

        private void UpdatePrivatePanel()
        {
            var selectedPrivacy = is_public.SelectedValue;
            if (selectedPrivacy == "private")
            {
                subdivisionList.Enabled = false;
                subdivisionList.Items.Clear();
            }
            else
            {

                if (subdivisionList.Items.Count == 0)
                {
                    var serializer = new JavaScriptSerializer();

                    var client = new Campus.SDK.Client();
                    var url = Campus.SDK.Client.BuildUrl("IrGroup", "GetModeratedSubdivisions", new { SessionId });
                    var result = client.Get(url);

                    var inner = JsonConvert.DeserializeObject(result.Data.ToString());
                    if (inner != null)
                    {
                        var items = (inner as IEnumerable<Object>);
                        var groups = items.Cast<JObject>().ToList();
                        foreach (var item in groups)
                        {
                            subdivisionList.Items.Add(new ListItem(Convert.ToString(item["Name"]), Convert.ToString(item["DcSubdivisionId"])));
                        }
                    }

                }
                subdivisionList.Enabled = true;

            }

            PrivacyUpdatePanel.Update();
        }
    }
}