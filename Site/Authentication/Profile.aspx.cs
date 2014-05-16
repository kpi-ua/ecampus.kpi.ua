using Core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;

namespace Site.Authentication
{
    public partial class Success : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            try
            {
                var client = new Campus.SDK.Client();
                var result = client.Get(Campus.SDK.Client.BuildUrl("User", "GetCurrentUser", "?sessionId=" + SessionId));
                Photo.ImageUrl = result.Data.Photo;

                var serializer = new JavaScriptSerializer();
                var data = (Dictionary<string, object>)serializer.Deserialize<Dictionary<string, object>>(result.Data.ToString());

                if (!Page.IsPostBack)
                {
                    ParsePersonData(data);
                    ParseEmployees(data);
                    ParseProfiles(data);
                }

                var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "User/GetEffectivePermissions?sessionId=" + SessionId);

                if (answer != null)
                {
                    var dataArr = (ArrayList)answer["Data"];
                    GetEffectivePremissions(dataArr);
                }
                else
                {
                    throw (new Exception("Права пользователя не получены!"));
                }
            }
            catch (Exception ex)
            {
                PersData.Text = "<h1>Ошибка при загрузке страницы!!!<h1>";
            }

        }

        private void ParsePersonData(Dictionary<string, object> data)
        {
            PersData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + data["FullName"] + "</p>";
        }

        private void ParseEmployees(Dictionary<string, object> data)
        {
            var personalitiess = (ArrayList)data["Personalities"];
            var employees = (ArrayList)data["Employees"];

            for (int i = 0; i < personalitiess.Count; i++)
            {
                foreach (var w in (Dictionary<string, object>)personalitiess[i])
                {
                    if (w.Key == "SubdivisionId")
                    {

                    }
                    else if (w.Key == "SubdivisionName")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + w.Value + "</p>";
                    }
                    else if (w.Key == "StudyGroupName")
                    {
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Група: <i class=\"text-success\">" + w.Value + "</i></p>";
                    }
                    else if (w.Key == "IsContract")
                    {
                        var val = "ні";
                        if (w.Value.ToString().ToLower() == "true") { val = "так"; }
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Контрактна форма навчання: <i class=\"text-success\">" + val + "</i></p>";
                    }
                    else if (w.Key == "Specialty")
                    {
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Спеціальність: <i class=\"text-success\">" + w.Value + "</i></p>";
                    }

                }
            }

            for (int i = 0; i < employees.Count; i++)
            {
                foreach (KeyValuePair<string, object> w in (Dictionary<string, object>)employees[i])
                {
                    if (w.Key == "SubdivisionId")
                    {

                    }
                    else if (w.Key == "SubdivisionName")
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + w.Value + "</p>";
                    }
                    else if (w.Key == "Position")
                    {
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + " Позиція: <i class=\"text-success\">" + w.Value + "</i></p>";
                    }
                    else if (w.Key == "AcademicDegree")
                    {
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Академічний ступінь: <i class=\"text-success\">" + w.Value + "</i></p>";
                    }
                }
            }
        }

        private void ParseProfiles(Dictionary<string, object> data)
        {
            var profiles = (ArrayList)data["Profiles"];

            SpecFunc.Text += "<div style=\"margin-left:10px;\" class=\"text-success\">";

            for (int i = 0; i < profiles.Count; i++)
            {
                foreach (var pk in (Dictionary<string, object>)profiles[i])
                {
                    switch (pk.Key)
                    {
                        case "SubsystemName":
                            {
                                SpecFunc.Text += "<p class=\"text-primary\">" + "\"" + pk.Value + "\"";
                                break;
                            }
                        case "ProfileName":
                            {
                                SpecFunc.Text += "<i class=\"text-success\">" + "( " + pk.Value + " )" + "</i></p>";
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

        private void GetEffectivePremissions(ArrayList data)
        {
            var premDic = new Dictionary<string, Permission>();

            for (int i = 0; i < data.Count; i++)
            {
                Permission premObj = null;

                foreach (var pk in (Dictionary<string, object>)data[i])
                {
                    var prem = (pk.Value.ToString().ToLower() != "false");

                    switch (pk.Key)
                    {

                        case "SubsystemName":
                            {
                                premObj = new Permission(pk.Value.ToString());
                                break;
                            }
                        case "IsCreate":
                            {
                                premObj.Create = prem;
                                break;
                            }
                        case "IsRead":
                            {
                                premObj.Read = prem;
                                break;
                            }
                        case "IsUpdate":
                            {
                                premObj.Update = prem;
                                break;
                            }
                        case "IsDelete":
                            {
                                premObj.Delete = prem;
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }

                }
                if (premObj != null) premDic.Add(premObj.Subsystem, premObj);
                else throw (new Exception("Права пользователя не получены!"));
            }
            Session["UserPremissions"] = premDic;
        }

        protected void SavePass_Click(object sender, EventArgs e)
        {
            var currentPass = Session["UserPass"].ToString();
            if (OldPass.Text == currentPass)
            {
                if (NewPass.Text == NewPassCheak.Text)
                {
                    var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "user/ChangePassword?sessionId=" + SessionId.ToString() + "&old=" + OldPass.Text + "&password=" + NewPass.Text);

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

        protected void btnUpload_Click(object sender, EventArgs e)
        {
            var file = InputFile.PostedFile;

            var client = new Campus.SDK.Client();
            client.Authenticate(Session["UserLogin"].ToString(), Session["UserPass"].ToString());

            byte[] fileData = null;
            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                fileData = binaryReader.ReadBytes(file.ContentLength);

            }

            var result = client.UploadUserProfileImage(fileData);

        }
    }
}