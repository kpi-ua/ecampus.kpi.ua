using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Net;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace campus_new_age.Authentication
{
    public partial class Messages : System.Web.UI.Page
    {
        protected void Page_Init(object sender, EventArgs e) {

            //Dictionary<string, object> answer = GetData("http://api.ecampus.kpi.ua//message/GetUserConversations?sessionId=" + Session["UserData"].ToString());
            //Dictionary<string, object> Data = null;

            //if ( answer != null) {

               //Data = (Dictionary<string, object>)answer["Data"];


               LinkButton messageLink = new LinkButton();

               messageLink.Text = "click";
               messageLink.PostBackUrl = Request.Url.AbsoluteUri.ToString();
               messageLink.Attributes.Add("SomeAtribute", "12345");

               messageLink.Click += messageLink_Click;

               LinkContainer.Controls.Add(messageLink);
            //}

            

           

        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack) {
                
            }

        }

        protected void messageLink_Click(object sender, EventArgs e) {

            LinkButton activeLink = sender as LinkButton;

            if (activeLink != null)
            {
                Result.Text += "LinkButton Clicked" + " " + activeLink.Attributes["SomeAtribute"];
            }
            
        }

        public Dictionary<string, object> GetData(string request) {
            try
            {
                WebClient client = new WebClient();
                client.Encoding = System.Text.Encoding.UTF8;

                var json = client.DownloadString(request);
                var serializer = new JavaScriptSerializer();
                Dictionary<string, object> respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                return respDictionary;

            } catch (Exception ex) {

                return null;
            }

        }

       
    }
}