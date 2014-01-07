using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace campus_new_age.Authentication.Messages
{
    public partial class NewMessage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack) { 
                Dictionary<string, object> answer = null;
                ArrayList users;
                int page;

                answer = SameCore.GetData("http://api.ecampus.kpi.ua//message/GetUserConversation?sessionId=" + Session["UserData"].ToString() + "&GroupId=" + Session["GroupId"].ToString() + "&size=" + 100500);

                if (answer != null)
                {
                    Dictionary<string, object> Paging = (Dictionary<string, object>)answer["Paging"];
                    users = (ArrayList)answer["Data"];
                   
                }
            }
            else
            {
                HtmlGenericControl div = new HtmlGenericControl("div");
                SameCore.CreateErrorMessage(div);
                MainDiv.Controls.Add(div);
            }
            
        }

        protected void SendMessage_Click(object sender, EventArgs e)
        {

        }
    }
}