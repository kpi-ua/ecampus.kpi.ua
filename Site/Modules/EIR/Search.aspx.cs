using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.EIR
{
    public partial class Search : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            GetUser();
        }

        /// <summary>
        /// Отримує id поточного користувача, викликає GetCathedra
        /// </summary>
        private void GetUser()
        {
            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId);
            JavaScriptSerializer _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);
            var dataArr = (Dictionary<string, object>)result["Data"];

            foreach (var el in dataArr)
            {
                if (el.Key == "UserAccountId")
                {
                    var userId = el.Value.ToString();
                    GetCathedra(userId);
                    break;
                }
            }
        }

        /// <summary>
        /// Отримує кафедру користувача, робить перевірки, викликає ShowData
        /// </summary>
        /// <param name="userId"></param>
        private void GetCathedra(string userId)
        {
            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetCathedra?UserId=" + userId);

            var _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);
            var caf = (ArrayList)result["Data"];
            string cathedraId = "";

            List<string> usedCaf = new List<string>();

            foreach (Dictionary<string, object> item in caf)
            {
                if (item["DcSubdivisionId"] != null)
                {
                    string subtype = "";
                    cathedraId = item["DcSubdivisionId"].ToString();

                    //перевіряє на повтор кафедри (доволі часто таке буває)
                    if (!usedCaf.Contains(cathedraId))
                    {
                        var url = String.Format("{0}StudyGroup/GetSubdivisionData?sesionid={1}&dcSubdivisionId={2}",
                            Campus.SDK.Client.ApiEndpoint, CampusClient.SessionId, cathedraId);

                        var answer2 = CampusClient.GetData(url);

                        if (answer2 != null)
                        {
                            string CName = "";
                            var cathName = new HtmlGenericControl("h4");

                            foreach (var elem in (Dictionary<string, object>)answer2["Data"])
                            {
                                if (elem.Key == "Name" && elem.Value != null)
                                {
                                    cathName.InnerText = elem.Value.ToString();
                                    CName = elem.Value.ToString();
                                }
                                if (elem.Key == "DcSubdivisionTypeId" && elem.Value != null)
                                {
                                    subtype = elem.Value.ToString();
                                }
                            }

                            //Перевірка чи знайдений підрозділ це кафедра
                            if (subtype == "30")
                            {
                                if (list.Items.FindByValue(CName) == null)
                                {
                                    list.Items.Add(CName);
                                }

                                if (list.SelectedValue == CName)
                                {
                                    url = Campus.SDK.Client.BuildUrl("Employee", "Get", new
                                    {
                                        UserId = CurrentUser.UserAccountId,
                                        SessionId
                                    });

                                    var profiles = CampusClient.GetByUrl<List<Campus.Common.EmployeeProfile>>(url);

                                    ShowData(profiles);
                                }

                                usedCaf.Add(cathedraId);
                                subtype = "";
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Отримує дані про викладачів кожної кафедри та виводить їх
        /// </summary>
        /// <param name="profiles"></param>
        private void ShowData(List<Campus.Common.EmployeeProfile> profiles)
        {
            //кількість викладачів в рядку

            var count_empl_in_row = 4;
            var length = profiles.Count / count_empl_in_row + 1;
            var table = new HtmlGenericControl("table");
            var tr = new List<HtmlGenericControl>();

            for (int i = 0; i < length; i++)
            {
                var new_tr = new HtmlGenericControl("tr");
                new_tr.Attributes.Add("id", "group" + i.ToString());
                tr.Add(new_tr);
            }

            int row = 0;

            foreach (var profile in profiles)
            {
                var irLink = new LinkButton();
                var td = new HtmlGenericControl("td");
                var div = new HtmlGenericControl("div");
                var Fullname = new HtmlGenericControl("h5");
                var SubName = new HtmlGenericControl("h6");
                var Dutie = new HtmlGenericControl("h6");
                var AcademicDegree = new HtmlGenericControl("h6");
                var AcademicStatus = new HtmlGenericControl("p");
                var images = new StringBuilder();

                irLink.PostBackUrl = Request.Url.AbsolutePath;
                irLink.Attributes.Add("class", "irLink list-item list-item-info");
                irLink.Attributes.Add("Id", profile.Id.ToString());

                Fullname.InnerText = String.Format("ПІБ: {0}", profile.FullName);
                SubName.InnerText += profile.SubdivisionName;
                AcademicDegree.InnerText = profile.AcademicDegree;

                var url = CampusClient.GetUserProfileImage(profile.UserAccountId);
                images.AppendFormat(@"<img id =""employee_photo""{1}"""" src=""{0}"" style=""width:150px;height:200px""/>", url.ToString(), profile.UserAccountId);

                div.InnerHtml = images.ToString();
                div.Controls.Add(Fullname);
                div.Controls.Add(SubName);
                div.Controls.Add(Dutie);
                div.Controls.Add(AcademicDegree);
                irLink.Controls.Add(div);
                td.Controls.Add(irLink);

                int ind = row / count_empl_in_row;

                tr[ind].Controls.Add(td);
                table.Controls.Add(tr[ind]);
                row++;
            }

            LinkContainer.Controls.Add(table);
        }

        protected void list_SelectedIndexChanged(object sender, EventArgs e)
        {
            LinkContainer.Controls.Clear();

            GetUser();
        }
    }
}