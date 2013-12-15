using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace WebApplication.Authentication
{
    public partial class Success : Core.WebPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                var client = new Campus.SDK.Client();
                var result = client.Get(String.Format("{0}?sessionId={1}", Campus.SDK.Client.BuildUrl("User", "GetCurrentUser"), SessionId));

                var serializer = new JavaScriptSerializer();
                var data = serializer.Deserialize<Dictionary<string, object>>(result.Data.ToString());

                Photo.ImageUrl = data["Photo"].ToString();
                ParsePersonData(data);
                ParseEmployees(data);
                ParseProfiles(data);
            }
        }

        void ParsePersonData(Dictionary<string, object> data)
        {
            PersData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + data["FullName"] + "</p>";
        }

        void ParseEmployees(Dictionary<string, object> data)
        {

            var employees = (ArrayList)data["Employees"];

            for (int i = 0; i < employees.Count; i++)
            {
                foreach (KeyValuePair<string, object> w in (Dictionary<string, object>)employees[i])
                {
                    if (w.Key != "SubdivisionId")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + w.Value + "</p>";
                    }
                }
            }
        }

        void ParseProfiles(Dictionary<string, object> Data)
        {
            var profiles = (ArrayList)Data["Profiles"];

            SpecFunc.Text += "<div style=\"margin-left:10px;\" class=\"text-success\">";

            for (int i = 0; i < profiles.Count; i++)
            {

                foreach (KeyValuePair<string, object> pk in (Dictionary<string, object>)profiles[i])
                {

                    string boolValue = "так";

                    if (pk.Value.ToString().ToLower() == "false")
                    {
                        boolValue = "ні";
                    }

                    switch (pk.Key)
                    {

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