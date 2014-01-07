using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using Core;

namespace Site.Authentication
{
    public partial class NewMessage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                Dictionary<string, object> answer = null;
                ArrayList users;
                int page;

                answer = SameCore.GetData(Campus.SDK.Client.ApiEndpoint + "message/GetUserConversation?sessionId=" + Session["UserData"].ToString() + "&GroupId=" + Session["GroupId"].ToString() + "&size=" + 100500);

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