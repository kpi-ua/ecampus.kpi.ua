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

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            //var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId);
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
            json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetCathedra?UserId=" + UserId);
            _serializer = new JavaScriptSerializer();
            result = _serializer.Deserialize<Dictionary<string, object>>(json);
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
                            ShowData(data, CathedraId);
                        }
                        usedCaf.Add(CathedraId);
                    }
                }
            }
        }

        private void ShowData(ArrayList data, string CathedraId)
        {
            foreach (Dictionary<string, object> item in data)
            {
                var irLink = new LinkButton();
                var mainDiv = new HtmlGenericControl("div");
                var Name = new HtmlGenericControl("h5");
                var Course = new HtmlGenericControl("h6");
                var CathName = new HtmlGenericControl("h6");
                var Abr = new HtmlGenericControl("h6");
                mainDiv.Attributes.Add("id", "employee");

                var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetSubdivisionData?sesionid=" + CampusClient.SessionId + "&dcSubdivisionId=" + CathedraId);
                if (answer != null)
                {
                    var dataCath = answer["Data"];
                    foreach (var elem in (Dictionary<string, object>) dataCath)
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
                if (item["Name"] != null)
                {
                    Name.InnerText = item["Name"].ToString();
                }
                if (item["StudyCourse"] != null)
                {
                    Course.InnerText = "Курс: " + item["StudyCourse"].ToString();
                }
                mainDiv.Controls.Add(Name);
                mainDiv.Controls.Add(Course);
                mainDiv.Controls.Add(CathName);
                mainDiv.Controls.Add(Abr);

                irLink.Controls.Add(mainDiv);

                LinkContainer.Controls.Add(irLink);
            }
        }
    }
}