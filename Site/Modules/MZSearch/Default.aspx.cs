using System;

namespace Site.Modules.MZSearch
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (irEdit.Attributes["value"] != null && irEdit.Attributes["Value"] != "")
            {
                Session["EirEdit"] = true;
                Session["EirId"] = irEdit.Attributes["value"];
                Response.Redirect("~/Modules/EIR/CardEdit.aspx");
            }

            if (!Page.IsPostBack)
            {
                session.Attributes["Value"] = SessionId;
            }
        }
    }
}