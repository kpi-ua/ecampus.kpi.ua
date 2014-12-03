using System.Web.UI.WebControls;
using Campus.Common;
using Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Linq;
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
                        WorkData.Text += e.SubdivisionName + "</br>";
                        WorkData.Text += " Посада: <i class=\"text-success\">" + e.Position + "</i></br>";
                        WorkData.Text += "Академічний ступінь: <i class=\"text-success\">" + e.AcademicDegree + "</i></br>";

                    }

                    foreach (var p in CurrentUser.Personalities)
                    {
                        var val = p.IsContract ? "так" : "ні";

                        WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" + p.SubdivisionName + "</p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Група: <i class=\"text-success\">" + p.StudyGroupName + "</i></p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Контрактна форма навчання: <i class=\"text-success\">" + val + "</i></p>";
                        WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" + "Спеціальність: <i class=\"text-success\">" + p.Specialty + "</i></p>";
                    }

                    if (CurrentUser.IsConfirmed != null&&CurrentUser.IsConfirmed=="1")
                    {
                        MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" " +
                                           "aria-hidden=\"true\">&times;</button>" +
                                           "Ви дозволили розміщення вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет." +
                                           "</div></div>";
                    }
                    if (CurrentUser.ReasonFailure != null)
                    {
                        MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" " +
                                           "aria-hidden=\"true\">&times;</button>" +
                                           "Ви не дозволили розміщення вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет. Ви відмовились по причині:" +
                                           "<br>"+CurrentUser.ReasonFailure+"</div></div>";
                    }
                    UserContactsLiteral.Text += "<tr><td>Контактні дані:</td></tr>";
                    foreach (var p in CurrentUser.Contacts)
                    {
                        UserContactsLiteral.Text += "<tr><td>" + p.ContactTypeName + "</td>";
                        UserContactsLiteral.Text += "<td>" + p.UserContactValue + "</td>";
                        UserContactsLiteral.Text +="<td class=\"glyphicon glyphicon-eye-open\"></td></tr>";
                    }
                    List<Campus.Common.TimeTable> ttList = null;
                    if (CurrentUser.Employees.Count() >= 1)
                    {
                        ttList = CampusClient.GeTimeTables(SessionId, "employee");
                    }
                    if (CurrentUser.Personalities.Count() >= 1)
                    {
                        ttList = CampusClient.GeTimeTables(SessionId, "student");
                    }
                    if (ttList != null)
                    {

                        for (int w = 0; w < 2; w++)
                        {
                            TimeTablesLiteral.Text += "<h5 align=\"center\"> " + (w + 1) + "-й тиждень</h5>" +
                           "  <table class=\"table table-bordered table-hover\"><tr><td></td><td>Понеділок</td><td>Вівторок</td><td>Середа</td>" +
                           "<td>Четвер</td><td>П'ятниця</td><td>Субота</td></tr>";
                            for (int l = 0; l < 5; l++)
                            {
                                TimeTablesLiteral.Text += "<tr><td>" + (l + 1) + "</td>";
                                for (int d = 0; d < 6; d++)
                                {
                                    if (
                                        !ttList.Exists(
                                            table =>
                                                table.WeekNum == w + 1 && table.LessonId == l + 1 &&
                                                table.DayId == d + 1))
                                    {
                                        TimeTablesLiteral.Text += "<td></td>";
                                    }
                                    else
                                    {
                                        var lesson = ttList.SingleOrDefault(
                                            table =>
                                                table.WeekNum == w + 1 &&
                                                table.LessonId == l + 1 &&
                                                table.DayId == d + 1);
                                        TimeTablesLiteral.Text += "<td>" + lesson.Subject + "<br>" +
                                                                  lesson.Employee + "<br>" + lesson.Building
                                                                  //+ "<br>" + lesson.GroupName + "</td>"
                                                                  + "</td>";
                                    }
                                }
                                TimeTablesLiteral.Text += "</tr>";
                            }
                            TimeTablesLiteral.Text += "</table><br><br>";
                        }
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

        public void btnFailure_Click(object sender, EventArgs e)
        {
            if (CampusClient.SetReasonFailure(SessionId, ReasonTextBox.Text))
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" " +
                                           "aria-hidden=\"true\">&times;</button>" +
                                           "Ви не дозволили розміщення вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет. Ви відмовились по причині:" +
                                           "<br>" + CurrentUser.ReasonFailure + "</div></div>";
            }
        }

        public void btnConfirm_Click(object sender, EventArgs e)
        {
            if (CampusClient.IsConfirmSet(SessionId))
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" " +
                                           "aria-hidden=\"true\">&times;</button>" +
                                           "Ви дозволили розміщення вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет." +
                                           "</div></div>";
            }
            
        }

        private void LoadCarousel()
        {
            var sb = new StringBuilder();

            var links = new List<Core.Link>
            {
                new Link {Title = "Мій профіль", Image = CurrentUser.Photo, Url = "/Default.aspx"},
                new Link {Title = "Дошка оголошень", Image = "/Images/carousel-billboard.jpg", Url = "/Modules/Bulletins"},
                new Link {Title = "Спілкування", Image = "/Images/carousel-msg.jpg", Url = "/Modules/Messages"},
                new Link {Title = "Розклад", Image = "/Images/carousel-schd.jpg", Url = "/Modules/TimeTable"},
                new Link {Title = "Підтримка", Image = "/Images/carousel-support.jpg", Url = "/Modules/Support.aspx"},
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

            //carousel_wrap.InnerHtml = sb.ToString();
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
            //error_message.Visible = true;
            //error_message_text.InnerText = text;
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


        protected global::System.Web.UI.WebControls.TextBox DenyPublicationPurpose;
        public Object DenyPublication()
        {
            //CampusClient.DenyPublication(SessionId, DenyPublicationPurpose.Text); не работает
            return null;
        }

        public Object AcceptPublication()
        {
            //CampusClient.AcceptPublication(SessionId); - не работает
            return null;
        }


    }
}