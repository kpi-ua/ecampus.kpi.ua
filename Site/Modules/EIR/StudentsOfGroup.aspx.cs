using Campus.SDK;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;

namespace Site.Modules.EIR
{
    public partial class StudentsOfGroup : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            string StudyGroupId = Request.QueryString["RtStudygroupId"];
            var Group = new HtmlGenericControl("h4");
            LinkContainer.Controls.Add(Group);
            Group.InnerText = "Студенти групи " + StudyGroupId + ": ";
            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Ir/GetPersonName?sessionId=" + SessionId+"&name=");
            if (answer != null)
            {
                var dataStGr = (ArrayList)answer["Data"];
                foreach (Dictionary<string, object> item in dataStGr)
                {
                    var Name = new HtmlGenericControl("p");
                    string Accessority = "";
                    if (item["Name"] != null)
                    {
                        string[] Parse = item["Name"].ToString().Split(',');
                        if (Parse[1] == " " + StudyGroupId)
                        {
                            string[] mas = Parse[0].Split('(');
                            Name.InnerText = mas[0];
                        }
                    }
                    if (item["Accessority"] != null)
                    {
                        Accessority = item["Accessority"].ToString();
                    }
                    if (Accessority == "stud" && Name.InnerText != null)
                    {
                        LinkContainer.Controls.Add(Name);
                    }
                }
            }
        }
    }
}