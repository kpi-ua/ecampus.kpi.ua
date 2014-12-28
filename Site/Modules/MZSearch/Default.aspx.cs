using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.WebControls;

namespace Site.MZSearch
{
    public partial class Default : Core.SitePage
    {
       
        protected void Page_Load(object sender, EventArgs e)
        {

            if (irEdit.Attributes["value"] != null && irEdit.Attributes["Value"].ToString() != "")
            {
                Session["EirEdit"] = true;
                Session["EirId"] = irEdit.Attributes["value"].ToString();
                Response.Redirect("~/Modules/EIR/CardEdit.aspx");
            }

            if (!Page.IsPostBack)
            {

                session.Attributes["Value"] = SessionId;
            }
        }    
    }
}