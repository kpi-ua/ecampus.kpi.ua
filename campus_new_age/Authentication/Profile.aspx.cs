using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Collections;
using System.Net;

namespace campus_new_age.Authentication
{
    public partial class Success : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                try
                {
                   
                        string sessionId = Session["UserData"].ToString();
                        WebClient client = new WebClient();
                        client.Encoding = System.Text.Encoding.UTF8;
                        var json = client.DownloadString("http://localhost:49945/User/GetCurrentUser?sessionId=" + sessionId);
                        var serializer = new JavaScriptSerializer();
                        Dictionary<string, object> respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                        Dictionary<string, object> Data = (Dictionary<string, object>)respDictionary["Data"];
                        Photo.ImageUrl = Data["Photo"].ToString();
                        ParsePersonData(Data);
                        ParseEmployees(Data);
                        ParseProfiles(Data);
                    
                }
                catch (Exception ex)
                {
                    PersData.Text = "<h1>Ошибка при загрузке страницы!!!<h1>";
                }
            }
        }

        void ParsePersonData(Dictionary<string, object> Data) {

            PersData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + Data["FullName"] + "</p>";
        }

        void ParseEmployees(Dictionary<string, object> Data) {

            ArrayList Employees = (ArrayList)Data["Employees"];

            for (int i = 0; i < Employees.Count; i++) {
                foreach (KeyValuePair<string, object> w in (Dictionary<string, object>)Employees[i]) {
                    if (w.Key != "SubdivisionId")
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + w.Value + "</p>";
                }
            }
        }

        void ParseProfiles(Dictionary<string, object> Data) {

            ArrayList Profiles = (ArrayList)Data["Profiles"];

            SpecFunc.Text += "<div style=\"margin-left:10px;\" class=\"text-success\">";
            for (int i = 0; i < Profiles.Count; i++) {

                foreach (KeyValuePair<string, object> pk in (Dictionary<string, object>)Profiles[i]) {

                    string boolValue = "так";

                    if (pk.Value.ToString().ToLower() == "false") {
                        boolValue = "ні";
                    }

                    switch (pk.Key) {

                        case "SubsystemName":
                            {
                                SpecFunc.Text += "<p><b>" + "\"" + pk.Value + "\"" + "</b></p>";
                                break;
                            }
                        case "IsCreate":
                            {
                                SpecFunc.Text += "<p>" + "Право на створення " + boolValue + "</p>";
                                break;
                            }
                        case "IsRead":
                            {
                                SpecFunc.Text += "<p>" + "Право на перегляд " + boolValue + "</p>";
                                break;
                            }
                        case "IsUpdate":
                            {
                                SpecFunc.Text += "<p>" + "Право на зміну " + boolValue + "</p>";
                                break;
                            }
                        case "IsDelete":
                            {
                                SpecFunc.Text += "<p>" + "Право на видалення " + boolValue + "</p>";
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }
            }
            SpecFunc.Text += "</div>";
        }


    }
}