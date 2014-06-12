using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Campus.SDK;
using Core;

namespace Site
{
    public partial class Search : Core.SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (irEdit.Attributes["value"] != null && irEdit.Attributes["Value"].ToString() != "")
            {
                Session["EirId"] = irEdit.Attributes["value"].ToString();
                Response.Redirect("~/EIR/CardView.aspx");
            }
        }

    }
}