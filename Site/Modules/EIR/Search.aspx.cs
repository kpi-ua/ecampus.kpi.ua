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

        //Отримує id поточного користувача, викликає GetCathedra
        private void GetUser()
        {
            string sessid = SessionId;
            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + sessid);
            JavaScriptSerializer _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);
            var dataArr = (Dictionary<string, object>)result["Data"];
            string UserId = "";
            foreach (var el in dataArr)
            {
                if (el.Key == "UserAccountId")
                {
                    UserId = el.Value.ToString();
                    GetCathedra(UserId);
                }
            }

        }

        //Отримує кафедру користувача, робить перевірки, викликає ShowData
        private void GetCathedra(string UserId)
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
                    string subtype = "";
                    CathedraId = item["DcSubdivisionId"].ToString();
                    //перевіряє на повтор кафедри (доволі часто таке буває)
                    if (!usedCaf.Contains(CathedraId))
                    {
                        var answer2 = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "StudyGroup/GetSubdivisionData?sesionid=" + CampusClient.SessionId + "&dcSubdivisionId=" + CathedraId);
                        if (answer2 != null)
                        {
                            string CName = "";
                            var CathName = new HtmlGenericControl("h4");
                            var dataCath = answer2["Data"];
                            foreach (var elem in (Dictionary<string, object>)dataCath)
                            {
                                if (elem.Key == "Name" && elem.Value != null)
                                {
                                    CathName.InnerText = elem.Value.ToString();
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
                                    var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Employee/GetEmployee?CathedraId=" + item["DcSubdivisionId"].ToString());
                                    if (answer != null)
                                    {
                                        var dataArr2 = (ArrayList)answer["Data"];
                                        ShowData(dataArr2);
                                    }
                                }
                                usedCaf.Add(CathedraId);
                                subtype = "";
                            }
                        }
                    }
                }
            }
        }

        //Отримує дані про викладачів кожної кафедри та виводить їх
        private void ShowData(ArrayList data)
        {
            //кількість викладачів в рядку
            int count_empl_in_row = 4;
            int length = data.Count / count_empl_in_row + 1;
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
                var div = new HtmlGenericControl("div");
                var Fullname = new HtmlGenericControl("h5");
                var SubName = new HtmlGenericControl("h6");
                var Dutie = new HtmlGenericControl("h6");
                var AcademicDegree = new HtmlGenericControl("h6");
                var AcademicStatus = new HtmlGenericControl("p");
                var images = new StringBuilder();

                irLink.PostBackUrl = Request.Url.AbsolutePath;
                irLink.Attributes.Add("class", "irLink list-item list-item-info");
                irLink.Attributes.Add("Id", item["eEmployees1Id"].ToString());
                string Fname = "ПІБ: ";
                if (item["Surname"] != null)
                {
                    Fname += item["Surname"].ToString() + " ";
                }
                if (item["Name"] != null)
                {
                    Fname += item["Name"].ToString() + " ";
                }
                if (item["Patronymic"] != null)
                {
                    Fname += item["Patronymic"].ToString();
                }
                Fullname.InnerText = Fname;
                if (item["SubdivName"] != null)
                {
                    SubName.InnerText += item["SubdivName"].ToString() + " ";
                }

                if (item["AcademicDegreeName"] != null)
                {
                    AcademicDegree.InnerText = item["AcademicDegreeName"].ToString();
                }

                if (item["UserAccountId"] != null)
                {
                    var answer = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Employee/GetEmployeePhoto?EmployeeAcountId=" + item["UserAccountId"].ToString());
                    JavaScriptSerializer _serializer = new JavaScriptSerializer();
                    var respDictionary = _serializer.Deserialize<Dictionary<string, object>>(answer);
                    var url = respDictionary["Data"];
                    images.AppendFormat(@"<img id =""employee_photo""{1}"""" src=""{0}"" style=""width:150px;height:200px""/>", url.ToString(), item["UserAccountId"].ToString());
                }
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