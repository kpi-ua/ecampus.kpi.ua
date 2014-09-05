using Core;
using System;
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
                

            }
            catch { }

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

        protected void SavePass_Click(object sender, EventArgs e)
        {
            if (OldPass.Text == UserPassword)
            {
                if (NewPass.Text == NewPassCheak.Text)
                {
                    CampusClient.ChangePassword(SessionId, OldPass.Text, NewPass.Text);
                    ShowErrorMessage("OK");
                    UserPassword = NewPass.Text;
                }
                else
                {
                    ShowErrorMessage("Новий пароль не співпав");
                }
            }
            else
            {
                ShowErrorMessage("Старий пароль неправильний");
            }
        }

        private void ShowErrorMessage(string text)
        {
            error_message.Visible = true;
            error_message_text.InnerText = text;
        }

        protected void btnUpload_Click(object sender, EventArgs e)
        {
            using (var binaryReader = new BinaryReader(file_upload.PostedFile.InputStream))
            {
                var fileData = binaryReader.ReadBytes(file_upload.PostedFile.ContentLength);
                CampusClient.Authenticate(UserLogin, UserPassword);
                CampusClient.UploadUserProfileImage(fileData);
            }
        }
    }
}