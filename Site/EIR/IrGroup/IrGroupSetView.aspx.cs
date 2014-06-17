using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.EIR.IrGroup
{
    public partial class IrGroupSetView : Core.SitePage
    {
        private int subdivisionId;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            subdivisionId = Convert.ToInt32(Request.QueryString["subdivisionId"]);

            string url;
            string urlSubdivision;

            if (subdivisionId == -1)
            {
                url = Campus.SDK.Client.BuildUrl("IrGroup", "GetAllPrivateIrGroups", new { SessionId });
                subdivision_name.InnerText = "Приватні";
            }
            else
            {
                url = Campus.SDK.Client.BuildUrl("IrGroup", "GetAllIrGroups", new { SessionId, subdivisionId });

                urlSubdivision = Campus.SDK.Client.BuildUrl("Subdivision", "GetSubdivisionData", new { SessionId, dcSubdivisionId = subdivisionId });
                var resultSubdivision = CampusClient.Get(urlSubdivision);
                var innerSubdivision = JsonConvert.DeserializeObject(resultSubdivision.Data.ToString());
                subdivision_name.InnerText = innerSubdivision["Name"];
            }

            var result = CampusClient.Get(url);

            var inner = JsonConvert.DeserializeObject(result.Data.ToString());

            if (inner != null)
            {
                var items = (inner as IEnumerable<Object>);
                var groups = items.Cast<JObject>().ToList();

                foreach (var group in groups)
                {
                    IrGroupListRendering(group);
                }
            }
        }

        private void IrGroupListRendering(JObject group)
        {
            var groupLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var name = new HtmlGenericControl("h5");
            var description = new HtmlGenericControl("p");


            groupLink.PostBackUrl = Request.Url.AbsolutePath;
            groupLink.Attributes.Add("class", "irGroupLink list-item list-item-info");
            groupLink.Attributes.Add("irGroupId", group["IrGroupId"].ToString());

            mainDiv.Attributes.Add("id", "irGroupMainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            name.Attributes.Add("id", "irGroupName");
            name.Attributes.Add("class", "text-primary");

            description.Attributes.Add("class", "irGroupDescription");

            name.InnerText = group["Name"].ToString();
            description.InnerText = group["Description"].ToString();

            mainDiv.Controls.Add(name);
            mainDiv.Controls.Add(description);
            groupLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(groupLink);
        }

        protected void NewGroup_Click(object sender, EventArgs e)
        {
            Session["groupEditMode"] = "create";
            Response.Redirect("NewIrGroup.aspx");
        }
    }
}