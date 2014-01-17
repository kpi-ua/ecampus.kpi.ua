using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;

namespace Site.TimeTable
{
    public partial class TimeTableEdit : System.Web.UI.Page
    {
        private WebClient _client;
        private JavaScriptSerializer _serializer;
        private string _sessionId;
        private object _data;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserData"] != null)
            {
                _sessionId = Session["UserData"].ToString();

                _client = new WebClient
                {
                    Encoding = System.Text.Encoding.UTF8
                };
                var json = _client.DownloadString("http://api.ecampus.kpi.ua/User/GetCurrentUser?sessionId=" + _sessionId);
                _serializer = new JavaScriptSerializer();
                var result = _serializer.Deserialize<Dictionary<string, object>>(json);
                _data = result["Data"];
            }
            else
            {
                Response.Redirect("../Authentication/Authentication.aspx");
            }

        }


        #region employee
        protected void EmployeeLoad()
        {
            EmployeeListLoad(1); //means first page
        }

        private void EmployeeListLoad(int pagenum)
        {
            employeelist.Items.Clear();
            employeelist.Items.Add(new ListItem("", ""));
            employeelist.Items.FindByValue("").Selected = true;

            int status;
            Dictionary<string, object> data;
            switch (workerradiolist.SelectedValue)
            {
                case "full":
                {
                    _client = new WebClient
                    {
                        Encoding = System.Text.Encoding.UTF8
                    };
                    var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetEmployees?sessionId=" + _sessionId + "&pagenum=" + pagenum + "&pagelength=" + 50);
                    _serializer = new JavaScriptSerializer();
                    var result = _serializer.Deserialize<Dictionary<string, object>>(json);
                    status = (int) result["StatusCode"];
                    data = (Dictionary<string, object>) result["Data"];
                    break;
                }
                case "part":
                {
                    _client = new WebClient
                    {
                        Encoding = System.Text.Encoding.UTF8
                    };
                    var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetTimeWorkers?sessionId=" + _sessionId + "&pagenum=" + pagenum + "&pagelength=" + 50);
                    _serializer = new JavaScriptSerializer();
                    var result = _serializer.Deserialize<Dictionary<string, object>>(json);
                    status = (int)result["StatusCode"];
                    data = (Dictionary<string, object>)result["Data"];
                    break;
                }
                default:
                {
                    return;
                }
            }

            if (status == 200)
            {
                if (pagenum > 1)
                {
                    employeelist.Items.Add(new ListItem("назад", "prev"));
                }

                Session["eepage"] = data["page"];
                Session["eepagecount"] = data["count"];
                var dict = (Dictionary<string, object>) data["dictionary"];
                foreach (var item in dict)
                {
                    employeelist.Items.Add(new ListItem((string)item.Value, item.Key));
                }

                if ((int) data["count"] > 1)
                {
                    employeelist.Items.Add(new ListItem("вперед","next"));
                }
            }
        }

        protected void workerradiolist_SelectedIndexChanged(object sender, EventArgs e)
        {
            EmployeeListLoad(1); //always first page
        }

        protected void employeelist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (employeelist.SelectedValue == "prev")
            {
                EmployeeListLoad((int)Session["eepage"] - 1);
            }
            if (employeelist.SelectedValue == "next")
            {
                EmployeeListLoad((int)Session["eepage"] + 1);
            }
        }
        #endregion

        protected void FacultyListLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetFaculties?sessionId=" + _sessionId);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var data = (Dictionary<string, object>) result["Data"];

                foreach (var item in data)
                {
                    facultylist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        protected void SubdivisionListLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json =
                _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetSubdivisions?sessionId=" + _sessionId +
                                       "&facultyId=" + facultylist.SelectedValue);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var data = (Dictionary<string, object>)result["Data"];

                foreach (var item in data)
                {
                    subdivisionlist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        protected void SpecialitiesLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetSpecialities?sessionId=" + _sessionId + "&subdivisionId=" + subdivisionlist.SelectedValue);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var list = (Dictionary<string, object>)result["Data"];

                foreach (var item in list)
                {
                    specialitylist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        
        protected void StudyFormListLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetStudyForms?sessionId=" + _sessionId);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var list = (Dictionary<string, object>)result["Data"];

                foreach (var item in list)
                {
                    studyformlist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        protected void SubjectsLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };

            var json =
                _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetSubjects?sessionId=" + _sessionId +
                                       "&course=" + courselist.SelectedValue + "&specialityId=" +
                                       specialitylist.SelectedValue + "&studyFormId=" +
                                       studyformlist.SelectedValue);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var list = (Dictionary<string, object>) result["Data"];

                foreach (var item in list)
                {
                    subjectlist.Items.Add(new ListItem((string) item.Value, item.Key));
                }
            }
        }

        private void StudyGroupLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json =
                _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetStudyGroups?sessionId=" + _sessionId +
                                      "&specialityId=" + specialitylist.SelectedValue);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var list = (Dictionary<string, object>)result["Data"];

                foreach (var item in list)
                {
                    studygrouplist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        private void BuildingLoad()
        {
            _client = new WebClient
            {
                Encoding = System.Text.Encoding.UTF8
            };
            var json =
                _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/GetBuildings?sessionId=" + _sessionId);
            _serializer = new JavaScriptSerializer();
            var result = _serializer.Deserialize<Dictionary<string, object>>(json);

            if (result["StatusCode"].ToString() == "200")
            {
                var list = (Dictionary<string, object>)result["Data"];

                foreach (var item in list)
                {
                    buildinglist.Items.Add(new ListItem((string)item.Value, item.Key));
                }
            }
        }

        protected void worker_Load(object sender, EventArgs e)
        {

            if (!Page.IsPostBack)
            {
                EmployeeLoad();
                StudyFormListLoad();
                FacultyListLoad();
                BuildingLoad();
            }
        }

        protected void courselist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (courselist.SelectedValue != "" && specialitylist.SelectedValue != "" &&
                studyformlist.SelectedValue != "")
            {
                SubjectsLoad();
            }
        }

        protected void subdivisionlist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (subdivisionlist.SelectedValue != "")
            {
                SpecialitiesLoad();
            }
        }

        protected void specialitylist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (courselist.SelectedValue != "" && specialitylist.SelectedValue != "" &&
                studyformlist.SelectedValue != "")
            {
                SubjectsLoad();
            }

            if (specialitylist.SelectedValue != "")
            {
                StudyGroupLoad();
            }
        }

        protected void studyformlist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (courselist.SelectedValue != "" && specialitylist.SelectedValue != "" &&
                studyformlist.SelectedValue != "")
            {
                SubjectsLoad();
            }
        }

        protected void facultylist_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (facultylist.SelectedValue != "")
            {
                SubdivisionListLoad();
            }
        }

        protected void save_Click(object sender, EventArgs e)
        {
            if (employeelist.SelectedValue != "" && studygrouplist.SelectedValue != "" &&
                subjectlist.SelectedValue != "" && buildinglist.SelectedValue != "" && lessonlist.SelectedValue != "" &&
                weekdaylist.SelectedValue != "")
            {
                _client = new WebClient
                {
                    Encoding = System.Text.Encoding.UTF8
                };
                var json = _client.DownloadString("http://api.ecampus.kpi.ua/TimeTable/SaveSubject?sessionId=" + _sessionId + "&timeworker=" + (workerradiolist.SelectedValue == "full" ? "false" : "true") + "&employeeId=" + employeelist.SelectedValue + "&studyGroup=" + studygrouplist.SelectedValue + "&subjectId=" + subjectlist.SelectedValue + "&buildingId=" + buildinglist.SelectedValue + "&timeId=" + lessonlist.SelectedValue + "&weekdayId=" + weekdaylist.SelectedValue + "&weeknum=" + weeknumlist.SelectedValue);
                _serializer = new JavaScriptSerializer();
                var result = _serializer.Deserialize<Dictionary<string, object>>(json);

                if (result["StatusCode"].ToString() == "200")
                {
                    answer.Text = "Предмет сохранен.";
                }
            }
        }

    }
}