using Core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Site
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs ea)
        {
            base.OnLoad(ea);

            LoadCarousel();

            try
            {
                profile_photo.ImageUrl = CurrentUser.Photo;

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

        private void LoadCarousel()
        {
            var sb = new StringBuilder();

            var links = new List<Core.Link>
            {
                new Link {Title = "Мій профіль", Image = CurrentUser.Photo, Url = "/Default.aspx"},
                new Link {Title = "Дошка оголошень", Image = "/Images/carousel-billboard.jpg", Url = "/Bulletins"},
                new Link {Title = "Спілкування", Image = "/Images/carousel-msg.jpg", Url = "/Messages"},
                new Link {Title = "Розклад", Image = "/Images/carousel-schd.jpg", Url = "/TimeTable"},
                new Link {Title = "Підтримка", Image = "/Images/carousel-support.jpg", Url = "/Support.aspx"},
            };

            foreach (var link in links)
            {
                sb.AppendLine("<div class=\"slide\">");
                sb.AppendLine("<div class=\"slide-content\">");
                sb.AppendFormat("<a href=\"{0}\">", link.Url);
                sb.AppendFormat("<img src=\"{0}\" alt=\"{1}\" />", link.Image, link.Title);
                sb.AppendFormat("<div class=\"slide-title\">{0}</div>", link.Title);
                sb.AppendLine("</a></div></div>");
            }

            carousel_wrap.InnerHtml = sb.ToString();
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
            if (OldPass.Text == UserPassword)
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

                        UserPassword = NewPass.Text;
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
            using (var binaryReader = new BinaryReader(InputFile.PostedFile.InputStream))
            {
                var fileData = binaryReader.ReadBytes(InputFile.PostedFile.ContentLength);
                CampusClient.Authenticate(UserLogin, UserPassword);
                CampusClient.UploadUserProfileImage(fileData);
            }
        }
    }
}