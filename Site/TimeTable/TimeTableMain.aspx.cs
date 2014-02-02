using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Site.TimeTable
{
    public partial class TimeTableMain : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                WebClient client = new WebClient();

                //WebProxy p = new WebProxy("10.13.100.13:3128", true);
                //p.Credentials = new NetworkCredential("kbis_user", "kbis13");
                //WebRequest.DefaultWebProxy = p;
                //client.Proxy = p;

                String request = String.Format("{0}User/GetCurrentUser?sessionId={1}", Campus.SDK.Client.ApiEndpoint, Session["UserData"] ?? "null");

                var json = client.DownloadString(request);

                var serializer = new JavaScriptSerializer();

                var answer = serializer.Deserialize<Dictionary<string, object>>(json);
            }
            catch (Exception)
            {
                Response.Redirect("/Authentication/Authentication.aspx");
            }
           
        }

    }
}