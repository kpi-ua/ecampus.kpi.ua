using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace campus_new_age.RNP
{
    public partial class RNP_view : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

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