using System;

namespace Site
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            Response.Redirect("~/Authentication/Authentication.aspx");
        }
    }
}