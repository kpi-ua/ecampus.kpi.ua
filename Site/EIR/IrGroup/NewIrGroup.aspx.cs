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
                        break;
                    }
            }

            UpdatePrivatePanel();
        }


        private void FillValues()
        {
            throw new NotImplementedException();
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
                    string url;
                    if (is_public.SelectedValue == "private")
                    {
                        url = Campus.SDK.Client.BuildUrl("IrGroup", "CreatePrivateIrGroup", new { SessionId, groupName, description });
                    }
                    else
                    {
                        var subdivisionId = Convert.ToInt32(subdivisionList.SelectedValue);
                        url = Campus.SDK.Client.BuildUrl("IrGroup", "CreateIrGroup", new { SessionId, subdivisionId, groupName, description });
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
            UpdatePrivatePanel();
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