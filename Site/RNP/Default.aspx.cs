using System;

namespace Site.RNP
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
        }

        protected void btnAudHour_Click(object sender, EventArgs e)
        {
            btnAudHour.CssClass = "btn btn-sm btn-success";
            btnContEventSemestr.CssClass = "btn btn-sm btn-default";
        }

        protected void btnContEventSemestr_Click(object sender, EventArgs e)
        {
            btnAudHour.CssClass = "btn btn-sm btn-default";
            btnContEventSemestr.CssClass = "btn btn-sm btn-success";
        }


    }
}