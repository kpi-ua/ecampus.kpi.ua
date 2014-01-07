using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace campus_new_age.TimeTable
{
    public partial class TimeTableMain : System.Web.UI.Page
    {
        private WebClient client;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                string sessionId = Session["UserData"].ToString();
                if (Session["UserData"] == null)
                {
                    throw new Exception("Bad Authorisation!");
                }

                client = new WebClient();
                client.Encoding = System.Text.Encoding.UTF8;
                var json = client.DownloadString("http://api.ecampus.kpi.ua/User/GetCurrentUser?sessionId=" + sessionId);
                var serializer = new JavaScriptSerializer();
                var objects = serializer.Deserialize<object>(json);
            }
            
            
        }


        protected void GetSubjects(int specialityId, int studyFormId, int course)
        {
            var json =
                client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetSubjects?sessionId=" +
                                      Session["UserData"].ToString() + "&course=" + course.ToString(CultureInfo.InvariantCulture) + "&specialityId=" +
                                      specialityId + "&dcStudyFormId=" + studyFormId);
        }

        protected void TimeTableFiller(Dictionary<string,List<string>> timeTableDictionary)
        {
            foreach (string key in timeTableDictionary.Keys)
            {
                for (int j = 0; j < timeTableDictionary[key].Count; j++)
                {
                    Control cont = FindControl(key + j.ToString());
                    Label lab = (Label) cont;
                    lab.Text = timeTableDictionary[key][j];
                }
            }
        }
    }
}