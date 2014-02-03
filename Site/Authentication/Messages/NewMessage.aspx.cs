using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Core;

namespace Site.Authentication
{
    public partial class NewMessage : Core.SitePage
    {
       

        protected void Page_Load(object sender, EventArgs e)
        {
            //if (!Page.IsPostBack)
            //{
                HtmlGenericControl hiddenField = new HtmlGenericControl("input");
                
                hiddenField.Attributes.Add("id", "hidden");

                hiddenField.Attributes.Add("type", "hidden");

                hiddenField.Attributes.Add("value", SessionId.ToString());

                MainDiv.Controls.Add(hiddenField);

                Subject.Text = "";

                Text.Text = "";

            //}

        }
    }
}