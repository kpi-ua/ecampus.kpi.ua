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
    public partial class StudyGroups : Core.SitePage
    {
        public bool finder = false;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            //var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId);
            GetUser();
        }

        private void GetUser()
        {
            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId.ToString());
            JavaScriptSerializer _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);
            var dataArr = (Dictionary<string, object>)result["Data"];
            string UserId = "";
            foreach (var el in dataArr)
            {
                if (el.Key == "UserAccountId")
                {
                    UserId = el.Value.ToString();
                }
            }
            GetData(UserId);
        }

        private void GetData( string UserId)
        {
            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetCathedra?UserId=" + UserId);
            var _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);
            var Caf = (ArrayList)result["Data"];
            string CathedraId = "";
            List<string> usedCaf = new List<string>();
            foreach (Dictionary<string, object> item in Caf)
            {
                if (item["DcSubdivisionId"] != null)
                {
                    CathedraId = item["DcSubdivisionId"].ToString();
                    if (!usedCaf.Contains(CathedraId))
                    {
                        var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetStudyGroups?CathedraId=" + CathedraId);
                        if (answer != null)
                        {
                            var data = (ArrayList)answer["Data"];
                            var answer2 = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetSubdivisionData?sesionid=" + CampusClient.SessionId + "&dcSubdivisionId=" + CathedraId);
                            if (answer2 != null)
                            {
                                var CathName = new HtmlGenericControl("p");
                                var dataCath = answer2["Data"];
                                foreach (var elem in (Dictionary<string, object>)dataCath)
                                {
                                    if (elem.Key == "Name" && elem.Value != null)
                                    {
                                        CathName.InnerText = elem.Value.ToString();
                                    }
                                }
                                LinkContainer.Controls.Add(CathName);
                            }
                            ShowData(data, CathedraId);
                        }
                        usedCaf.Add(CathedraId);
                    }
                }
            }
        }

        private void ShowData(ArrayList data, string CathedraId)
        {
            int length = data.Count / 4 + 1;
            var table = new HtmlGenericControl("table");
            List<HtmlGenericControl> tr = new List<HtmlGenericControl>();
            for (int i = 0; i < length; i++)
            {
                var new_tr = new HtmlGenericControl("tr");
                new_tr.Attributes.Add("id", "group" + i.ToString());
                tr.Add(new_tr);
            }
            int row = 0;
            foreach (Dictionary<string, object> item in data)
            {
                var irLink = new LinkButton();
                var td = new HtmlGenericControl("td");
                var Name = new HtmlGenericControl("h5");
                var Course = new HtmlGenericControl("h6");
                var CathName = new HtmlGenericControl("h6");
                var Abr = new HtmlGenericControl("h6");

                var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetSubdivisionData?sesionid=" + CampusClient.SessionId + "&dcSubdivisionId=" + CathedraId);
                bool finded = false;
                if (answer != null)
                {
                    var dataCath = answer["Data"];
                    foreach (var elem in (Dictionary<string, object>)dataCath)
                    {
                        if (elem.Key == "Name" && elem.Value != null)
                        {
                            CathName.InnerText = elem.Value.ToString();
                        }
                        if (elem.Key == "Abbreviation" && elem.Value != null)
                        {
                            Abr.InnerText = elem.Value.ToString();
                        }
                    }
                }

                if (item["RtStudyGroupId"] != null)
                {
                    irLink.PostBackUrl = Request.Url.AbsolutePath;
                    irLink.Attributes.Add("class", "irLink list-item list-item-info");
                    irLink.Attributes.Add("Id", item["RtStudyGroupId"].ToString());
                }
                if (finder)
                {
                    if (item["Name"].ToString().Contains(word.Text))
                    {
                        Name.InnerText = item["Name"].ToString();
                        finded = true;
                    }
                }
                else if (item["Name"] != null)
                {
                    Name.InnerText = item["Name"].ToString();
                }
                if (item["StudyCourse"] != null)
                {
                    Course.InnerText = "Курс: " + item["StudyCourse"].ToString();
                }
                if (finded)
                {
                    irLink.Controls.Add(Name);
                    irLink.Controls.Add(Course);
                    irLink.Controls.Add(CathName);
                    irLink.Controls.Add(Abr);
                    td.Controls.Add(irLink);
                    int ind = row / 4;
                    tr[ind].Controls.Add(td);
                    table.Controls.Add(tr[ind]);
                    row++;
                    finded = false;
                }
                else 
                {
                    if (!finder) 
                    {
                        irLink.Controls.Add(Name);
                        irLink.Controls.Add(Course);
                        irLink.Controls.Add(CathName);
                        irLink.Controls.Add(Abr);
                        td.Controls.Add(irLink);
                        int ind = row / 4;
                        tr[ind].Controls.Add(td);
                        table.Controls.Add(tr[ind]);
                        row++;
                        finded = false;
                    }
                }
            }
            LinkContainer.Controls.Add(table);
        }

        protected void find_Click1(object sender, EventArgs e)
        {
            finder = true;
            LinkContainer.Controls.Clear();
            all.Visible = true;
            GetUser();
        }

        protected void all_Click(object sender, EventArgs e)
        {
            all.Visible = false;
        }
    }
}