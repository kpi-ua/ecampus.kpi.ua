using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using Core;

namespace Site.Authentication
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
                    var json = client.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + sessionId);
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

        void ParsePersonData(Dictionary<string, object> Data)
        {

            PersData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + Data["FullName"] + "</p>";
        }

        void ParseEmployees(Dictionary<string, object> Data)
        {

            ArrayList Personalitiess = (ArrayList)Data["Personalities"];
            ArrayList Employees = (ArrayList)Data["Employees"];

            for (int i = 0; i < Personalitiess.Count; i++)
            {
                foreach (KeyValuePair<string, object> w in (Dictionary<string, object>)Personalitiess[i])
                {
                    if (w.Key == "SubdivisionId")
                    {

                    }
                    else if (w.Key == "SubdivisionName")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + w.Value + "</p>";
                    }
                    else if (w.Key == "StudyGroupName")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + "Група: " + w.Value + "</p>";
                    }
                    else if (w.Key == "IsContract")
                    {
                        var val = "ні";
                        if (w.Value.ToString().ToLower() == "true") { val = "так"; }
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + "Контрактна форма навчання: " + val + "</p>";
                    }
                    else if (w.Key == "Specialty")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + "Спеціальність: " + w.Value + "</p>";
                    }

                }
            }

            for (int i = 0; i < Employees.Count; i++)
            {
                foreach (KeyValuePair<string, object> w in (Dictionary<string, object>)Employees[i])
                {
                    if (w.Key == "SubdivisionId")
                    {

                    }
                    else if (w.Key == "SubdivisionName")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\"><b>" + w.Value + "</b></p>";
                    }
                    else if (w.Key == "Position")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + " Позиція: " + w.Value + "</b></p>";
                    }
                    else if (w.Key == "AcademicDegree")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-success\">" + "Академічний ступінь: " + w.Value + "</p>";
                    }
                }
            }
        }

        void ParseProfiles(Dictionary<string, object> Data)
        {

            ArrayList Profiles = (ArrayList)Data["Profiles"];

            SpecFunc.Text += "<div style=\"margin-left:10px;\" class=\"text-success\">";
            for (int i = 0; i < Profiles.Count; i++)
            {

                foreach (KeyValuePair<string, object> pk in (Dictionary<string, object>)Profiles[i])
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

        protected void SavePass_Click(object sender, EventArgs e)
        {
            var currentPass = Session["UserPass"].ToString();
            if (OldPass.Text == currentPass)
            {
                if (NewPass.Text == NewPassCheak.Text)
                {
                    Dictionary<string, object> answer = null;

                    answer = Helper.GetData("http://api.ecampus.kpi.ua//user/ChangePassword?sessionId=" + Session["UserData"].ToString() + "&old=" + OldPass.Text + "&password=" + NewPass.Text);

                    if (answer == null)
                    {
                        OldPassLabel.CssClass = "label label-danger";
                        OldPassLabel.Text = "Помилка сервера";
                        NewPassLabel.CssClass = "label label-danger";
                        NewPassLabel.Text = "Помилка сервера";
                        ChangePass.Attributes.Add("style", "display:inline;");
                    }
                    else
                    {
                        if (NewPassLabel.CssClass == "label label-danger" || OldPassLabel.CssClass == "label label-danger")
                        {
                            OldPassLabel.CssClass = "label label-primary";
                            OldPassLabel.Text = "Старий пароль";
                            NewPassLabel.CssClass = "label label-primary";
                            NewPassLabel.Text = "Новий пароль";
                            NewPassCheakLabel.CssClass = "label label-primary";
                            NewPassCheakLabel.Text = "Повторіть новий пароль";
                            ChangePass.Attributes.Add("style", "display:none;");
                        }
                        Session["UserPass"] = NewPass.Text;
                    }
                }
                else
                {
                    OldPassLabel.CssClass = "label label-primary";
                    OldPassLabel.Text = "Старий пароль";
                    NewPassLabel.CssClass = "label label-danger";
                    NewPassLabel.Text = "Новий пароль не співпав";
                    NewPassCheakLabel.CssClass = "label label-danger";
                    NewPassCheakLabel.Text = "Новий пароль не співпав";
                    ChangePass.Attributes.Add("style", "display:inline;");
                }
            }
            else
            {
                OldPassLabel.CssClass = "label label-danger";
                OldPassLabel.Text = "Старий пароль неправильний";
                NewPassLabel.CssClass = "label label-primary";
                NewPassLabel.Text = "Новий пароль";
                NewPassCheakLabel.CssClass = "label label-primary";
                NewPassCheakLabel.Text = "Повторіть новий пароль";
                ChangePass.Attributes.Add("style", "display:inline;");
            }
        }


    }
}