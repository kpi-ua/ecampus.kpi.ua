using Newtonsoft.Json.Linq;
using System;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.EIR
{
    public partial class GroupPage : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
        
            var groups = CampusClient.GetAllPrivateIrGroups(SessionId);

            foreach (var group in groups)
            {
                LinkButtonsRendering(group);
            }
        }

        private void LinkButtonsRendering(JObject group)
        {
            var groupLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var name = new HtmlGenericControl("h5");
            var description = new HtmlGenericControl("p");


            groupLink.PostBackUrl = Request.Url.AbsolutePath;
            //groupLink.Attributes.Add("class", "messageLink");
            groupLink.Attributes.Add("irGroupId", group["IrGroupId"].ToString());

            mainDiv.Attributes.Add("id", "mainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            name.Attributes.Add("id", "irGroupName");
            name.Attributes.Add("class", "text-primary");


            name.InnerText = group["Name"].ToString();
            description.InnerText = group["Description"].ToString();

            mainDiv.Controls.Add(name);
            mainDiv.Controls.Add(description);
            groupLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(groupLink);
        }
    }
}