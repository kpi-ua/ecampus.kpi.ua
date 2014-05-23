using Core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;

namespace Site
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs ea)
        {
            base.OnLoad(ea);

            try
            {
                Photo.ImageUrl = CurrentUser.Photo;

                if (!Page.IsPostBack)
                {
                    PersData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + CurrentUser.FullName + "</p>";

                    foreach (var e in CurrentUser.Employees)
                    {
                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + e.SubdivisionName + "</p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + " Позиція: <i class=\"text-success\">" + e.Position + "</i></p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Академічний ступінь: <i class=\"text-success\">" + e.AcademicDegree + "</i></p>";

                    }

                    foreach (var p in CurrentUser.Personalities)
                    {
                        var val = p.IsContract ? "так" : "ні";

                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + p.SubdivisionName + "</p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Група: <i class=\"text-success\">" + p.StudyGroupName + "</i></p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Контрактна форма навчання: <i class=\"text-success\">" + val + "</i></p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Спеціальність: <i class=\"text-success\">" + p.Specialty + "</i></p>";
                    }

                    SpecFunc.Text += "<div style=\"margin-left:10px;\" class=\"text-success\">";

                    foreach (var p in CurrentUser.Profiles)
                    {
                        SpecFunc.Text += "<p class=\"text-primary\">" + "\"" + p.SubsystemName + "\"";
                        SpecFunc.Text += "<i class=\"text-success\">" + "( " + p.ProfileName + " )" + "</i></p>";
                    }

                    SpecFunc.Text += "</div>";
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


        private void GetEffectivePremissions(ArrayList data)
        {
            Permissions = new Dictionary<string, Permission>();

            for (int i = 0; i < data.Count; i++)
            {
                Permission permission = null;

                foreach (var p in (Dictionary<string, object>)data[i])
                {
                    var prem = (p.Value.ToString().ToLower() != "false");

                    switch (p.Key)
                    {
                        case "SubsystemName":
                            {
                                permission = new Permission(p.Value.ToString());
                                break;
                            }
                        case "IsCreate":
                            {
                                permission.Create = prem;
                                break;
                            }
                        case "IsRead":
                            {
                                permission.Read = prem;
                                break;
                            }
                        case "IsUpdate":
                            {
                                permission.Update = prem;
                                break;
                            }
                        case "IsDelete":
                            {
                                permission.Delete = prem;
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }

                if (permission != null)
                {
                    Permissions.Add(permission.Subsystem, permission);
                }
                else
                {
                    throw (new Exception("Права пользователя не получены!"));
                }
            }
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

            byte[] fileData;

            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                fileData = binaryReader.ReadBytes(file.ContentLength);
            }

            client.UploadUserProfileImage(fileData);
        }
    }
}