using System;

namespace Site
{
    public partial class Default : System.Web.UI.Page
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            Response.Redirect("~/Authentication/Authentication.aspx");
        }
    }
}