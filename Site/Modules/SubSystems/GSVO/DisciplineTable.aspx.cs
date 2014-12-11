using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Site.Modules.SubSystems.GSVO
{
    public partial class DisciplineTable : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(Session == null)
            {
                Response.Redirect("/login");
            }

            CathName.Text += " <h4 class=\"text-success\">" + Session["SubdivisionName"] + "</h4></br>";
            SpecName.Text += "<i class=\"text-success\">" + Session["GSVOSpec"] + "</i>";
        }
    }
}