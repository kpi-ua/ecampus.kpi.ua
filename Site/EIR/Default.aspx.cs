using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Campus.SDK;
using Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Site.EIR
{
    public partial class Default : SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            //LoadSearchTab();
        }

        bool isGroup;
        Client client;
        string addGroupUrl;
        void LoadSearchTab()
        {
            if (Request.QueryString["type"] != null)
            {
                isGroup = (Request.QueryString["type"].Equals("group"));
                var irGroupId = Session["irGroupId"].ToString();
                addGroupUrl = Campus.SDK.Client.BuildUrl("IrGroup", "AddIrToGroup", new { SessionId, irGroupId }) + "&irId=";
            }

            client = new Campus.SDK.Client();
            var url = Campus.SDK.Client.BuildUrl("Ir", "GetIr", new { SessionId });

            var result = client.Get(url);

            var inner = JsonConvert.DeserializeObject(result.Data.ToString());
            if (inner != null)
            {
                var items = (inner as IEnumerable<Object>).Cast<JObject>().ToList();
                foreach (var ir in items)
                {
                    LinkButtonsRendering(ir);
                }
            }
        }

        private void LinkButtonsRendering(JObject group)
        {
            var irLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var nameShort = new HtmlGenericControl("h5");
            var nameFull = new HtmlGenericControl("h6");
            var description = new HtmlGenericControl("p");


            irLink.PostBackUrl = Request.Url.AbsolutePath;
            irLink.Attributes.Add("class", "irLink list-item list-item-info");
            irLink.Attributes.Add("IrId", group["IrId"].ToString());

            mainDiv.Attributes.Add("id", "irGroupMainBlock");
            //mainDiv.Attributes.Add("class", ".form-inline");

            nameShort.Attributes.Add("id", "irGroupName");
            //nameShort.Attributes.Add("class", "text-primary");

            //description.Attributes.Add("class", "irGroupDescription");

            nameShort.InnerText = group["NameShort"].ToString();
            nameFull.InnerText = group["NameFull"].ToString();
            description.InnerText = group["IrId"].ToString();



            mainDiv.Controls.Add(nameShort);
            mainDiv.Controls.Add(nameFull);
            mainDiv.Controls.Add(description);

            irLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(irLink);

            if (isGroup)
            {
                var addToGroupButton = new Button();
                addToGroupButton.UseSubmitBehavior = false;
                addToGroupButton.Text = "Додати до групи";
                var url = addGroupUrl + group["IrId"].ToString();
                addToGroupButton.OnClientClick = "httpGet(\"" + url + "\"); return false;";
                LinkContainer.Controls.Add(addToGroupButton);
            }
        }
    }
}