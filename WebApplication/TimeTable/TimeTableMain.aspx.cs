using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication.TimeTable
{
    public partial class TimeTableMain : Core.WebPage
    {
        //private WebClient client;
        private Campus.SDK.Client _client;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {
                _client = new Campus.SDK.Client();

                var json = _client.Get(Campus.SDK.Client.BuildUrl("User", "GetCurrentUser") + "?sessionId=" + SessionId);
                var serializer = new JavaScriptSerializer();
                var objects = serializer.Deserialize<object>(json.Data.ToString());
            }
        }


        protected void GetSubjects(int specialityId, int studyFormId, int course)
        {
            var url = Campus.SDK.Client.BuildUrl("TimeTable", "GetSubjects") + "?sessionId=" + SessionId + "&course=" + course + "&specialityId=" + specialityId + "&dcStudyFormId=" + studyFormId;
            var result = _client.Get(url);
        }

        protected void TimeTableFiller(Dictionary<string, List<string>> timeTableDictionary)
        {
            foreach (string key in timeTableDictionary.Keys)
            {
                for (int j = 0; j < timeTableDictionary[key].Count; j++)
                {
                    Control cont = FindControl(key + j.ToString());
                    Label lab = (Label)cont;
                    lab.Text = timeTableDictionary[key][j];
                }
            }
        }
    }
}