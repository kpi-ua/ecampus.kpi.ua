using Campus.SDK;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Text;
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
            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Ir/GetPersonName?sessionId=" + SessionId + "&name=");



            if (answer != null)
            {
                var dataStGr = (ArrayList)answer["Data"];
                int count_empl_in_row = 4;
                int length = dataStGr.Count / count_empl_in_row + 1;
                var table = new HtmlGenericControl("table");
                List<HtmlGenericControl> tr = new List<HtmlGenericControl>();
                for (int i = 0; i < length; i++)
                {
                    var new_tr = new HtmlGenericControl("tr");
                    new_tr.Attributes.Add("id", "group" + i.ToString());
                    tr.Add(new_tr);
                }
                int row = 0;
                foreach (Dictionary<string, object> item in dataStGr)
                {
                    var im = new StringBuilder();
                    var div = new HtmlGenericControl("div");
                    var td = new HtmlGenericControl("td");
                    var Name = new HtmlGenericControl("h5");
                    string Accessority = "";
                    if (item["Accessority"] != null)
                    {
                        Accessority = item["Accessority"].ToString();
                    }
                    if (Accessority == "stud" && Name.InnerText != null)
                    {
                        if (item["Id"] != null)
                        {
                            var url = CampusClient.GetUserProfileImage(Convert.ToInt32(item["Id"]));
                            im.AppendFormat(@"<img id =""employee_photo""{1}"""" src=""{0}"" style=""width:150px;height:200px""/>", url.ToString(), item["Id"].ToString());
                        }
                        if (item["Name"] != null)
                        {
                            string[] Parse = item["Name"].ToString().Split(',');
                            if (Parse[1] == " " + StudyGroupId)
                            {
                                string[] mas = Parse[0].Split('(');
                                Name.InnerText = mas[0];
                                div.InnerHtml = im.ToString();
                                div.Controls.Add(Name);
                                td.Controls.Add(div);
                                int ind = row / count_empl_in_row;
                                tr[ind].Controls.Add(td);
                                table.Controls.Add(tr[ind]);
                                row++;
                            }
                        }
                    }
                }
                LinkContainer.Controls.Add(table);
            }

        }

    }
}