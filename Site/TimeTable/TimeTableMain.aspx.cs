using System;

namespace Site.TimeTable
{
    public partial class TimeTableMain : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            try
            {

                var client = new Campus.SDK.Client();
                var url = Campus.SDK.Client.BuildUrl("User", "GetCurrentUser", "?sessionId=" + SessionId);
                var result = client.Get(url);
                var json = result.Data.ToString();

                //?
            }
            catch (Exception)
            {
                Response.Redirect("/Authentication/Authentication.aspx");
            }
        }
    }
}