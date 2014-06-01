using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.EIR.IrGroup
{
    public partial class IrGroupView : Core.SitePage
    {

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (SessionId != null)
            {
                var content = GetGroupContentByID(Convert.ToInt32(Session["irGroupId"]));
                foreach(var ir in content) {
                    LinkButtonsRendering(ir);
                }
            }
            else
            {
                var mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }
        }

        private List<JObject> GetGroupContentByID(int irGroupId)
        {
            var client = new Campus.SDK.Client();
            var url = Campus.SDK.Client.BuildUrl("IrGroup", "GetIrGroupContent", new { SessionId, irGroupId });
            var result = client.Get(url);

            var inner = JsonConvert.DeserializeObject(result.Data.ToString());
            if (inner != null)
            {
                var items = (inner as IEnumerable<Object>);
                return items.Cast<JObject>().ToList();
            }
            return new List<JObject>();
        }

        private void LinkButtonsRendering(JObject group)
        {
            var groupLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var nameShort = new HtmlGenericControl("h5");
            var nameFull = new HtmlGenericControl("h6");
            var description = new HtmlGenericControl("p");


            groupLink.PostBackUrl = Request.Url.AbsolutePath;
            //groupLink.Attributes.Add("class", "messageLink");
            groupLink.Attributes.Add("IrId", group["IrId"].ToString());

            mainDiv.Attributes.Add("id", "mainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            nameShort.Attributes.Add("id", "irGroupName");
            nameShort.Attributes.Add("class", "text-primary");


            nameShort.InnerText = group["NameShort"].ToString();
            nameFull.InnerText = group["NameFull"].ToString();
            description.InnerText = group["Description"].ToString();

            mainDiv.Controls.Add(nameShort);
            mainDiv.Controls.Add(nameFull);
            mainDiv.Controls.Add(description);
            groupLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(groupLink);
        }

        protected void EditGroup_Click(object sender, EventArgs e)
        {
            if (SessionId != null)
            {
                Response.Redirect("NewIrGroup.aspx" +
                    "?type=edit");
            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }

        }

    }

}