using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Core;

namespace Site.Authentication
{
    public partial class NewMessage : System.Web.UI.Page
    {
        protected void Page_Init(Object sender, EventArgs e) {

            UserList.TextChanged += ListBoxText_Changed; 
            
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
               

                Dictionary<string, object> answer = null;
                ArrayList users;

               

                if (answer != null)
                {
                    users = (ArrayList)answer["Data"];

                }
            }
            else
            {
                HtmlGenericControl div = new HtmlGenericControl("div");
                Helper.CreateErrorMessage(div);
                MainDiv.Controls.Add(div);
            }

        }

        protected void ListBoxText_Changed(object sender, EventArgs e) {
            
           
        }

        protected void SendMessage_Click(object sender, EventArgs e)
        {
           

        }
    }
}