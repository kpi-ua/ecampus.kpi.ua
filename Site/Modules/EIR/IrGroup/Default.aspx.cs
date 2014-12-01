using System;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.EIR.IrGroup
{
    public partial class Default : Core.SitePage
    {
        protected void Page_Init(object sender, EventArgs e)
        {
            //AutoLogin();

            IrGroupListRendering(-1, "Приватні");
            IrGroupListRendering(10193, "Кафедра технiчної кiбернетики ФІОТ");
        }

        public void AutoLogin()
        {
            //TODO debuging staff - delete!!!!!!!
            var client = new Campus.SDK.Client();
            client.Authenticate("123", "123");
            SessionId = client.SessionId;
        }

        private void IrGroupListRendering(int idVar, string nameVar)
        {
            var groupLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var name = new HtmlGenericControl("h5");

            groupLink.PostBackUrl = Request.Url.AbsolutePath;
            groupLink.Attributes.Add("class", "irGroupLink");
            groupLink.Attributes.Add("subdivisionIrId", idVar.ToString());

            mainDiv.Attributes.Add("id", "mainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            name.Attributes.Add("id", "irGroupSubdivisionName");
            name.Attributes.Add("class", "text-primary");


            name.InnerText = nameVar.ToString();

            mainDiv.Controls.Add(name);
            groupLink.Controls.Add(mainDiv);

            SubdivisionIrContainer.Controls.Add(groupLink);
        }


        protected void NewGroup_Click(object sender, EventArgs e)
        {
            //Session["group_level"] = "private";
            Response.Redirect("NewIrGroup.aspx");
        }
    }

}