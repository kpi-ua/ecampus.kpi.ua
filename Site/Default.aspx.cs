using System.Collections;
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
                    UserPersonalInfoAddToPage();
                }

                btnFailure.Attributes.Add("onclick", "$('#Cancel-modal').hide();document.body.style.overflow = 'auto';");
            }
            catch { }

        }

        public void UserPersonalInfoAddToPage()
        {
            NewUserCredoTextBox.Text = CampusClient.GetUserCredo(SessionId);
            if (CurrentUser.Employees.Count() != 0)
            {
                WorkData.Text += "<tr><td>Дані за місцем роботи:</td><td>";
                foreach (var e in CurrentUser.Employees)
                {
                    WorkData.Text += e.SubdivisionName + "</br>";
                    WorkData.Text += " Посада: <i class=\"text-success\">" + e.Position + "</i></br>";
                    WorkData.Text += "Академічний ступінь: <i class=\"text-success\">" + e.AcademicDegree +
                                     "</i></br>";

                }
            }
            if (CurrentUser.Personalities.Count() != 0)
            {
                WorkData.Text += "<tr><td>Дані за місцем навчання:</td><td>";
                foreach (var p in CurrentUser.Personalities)
                {
                    var val = p.IsContract ? "так" : "ні";

                    WorkData.Text += "<p style=\"margin-left:10px;\" class=\"text-primary\">" +
                                     p.SubdivisionName + "</p>";
                    WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" +
                                     "Група: <i class=\"text-success\">" + p.StudyGroupName + "</i></p>";
                    WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" +
                                     "Контрактна форма навчання: <i class=\"text-success\">" + val + "</i></p>";
                    WorkData.Text += "<p style=\"margin-left:20px;\" class=\"text-info\">" +
                                     "Спеціальність: <i class=\"text-success\">" + p.Specialty + "</i></p>";
                }
            }
            WorkData.Text += "</td>";
            if (CurrentUser.IsConfirmed != null && CurrentUser.IsConfirmed == "1")
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                   "<div class=\"alert alert-info alert-dismissable\">" +
                                   "Ви <strong>дозволили розміщення</strong> вашої персональної інформації на сайті " +
                                   "intellect.kpi.ua в мережі Інтернет." +
                                   "</div></div>";
                btnConfirm.CssClass = "btn btn-primary disabled";
                btnDenie.CssClass = "btn btn-primary";
            }
            if (CurrentUser.ReasonFailure != null)
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                   "<div class=\"alert alert-danger alert-dismissable\">" +
                                   "Ви <strong> не дозволили розміщення</strong> вашої персональної інформації на сайті " +
                                   "intellect.kpi.ua в мережі Інтернет. Ви відмовились по причині:" +
                                   "<br>" + CurrentUser.ReasonFailure + "</div></div>";
                btnConfirm.CssClass = "btn btn-primary";
                btnDenie.CssClass = "btn btn-primary disabled";

            }
            UserContactsLiteral.Text += "<tr><td>Контактні дані:</td></tr>";
            int i = 0;
            foreach (var p in CurrentUser.Contacts)
            {
                i++;
                UserContactsLiteral.Text += "<tr><td>" + p.ContactTypeName + "</td>";
                UserContactsLiteral.Text += "<td id=\"" + "RedUserCont" + p.UserContactId + "\">" + p.UserContactValue +
                                            "  <a class=\"glyphicon glyphicon-pencil " +
                                            "redagContact\"data-toggle=\"modal\" data-target=" +
                                            "\"#RedactUserContact-modal\" id=\"" + p.UserContactId + "RD" + "\"></a>" + "</td>";
                UserContactsLiteral.Text += "<td id=\"" + p.UserContactId + "VC" + "\"class=";


                //UserContactsLiteral.Text += "<td><span id=\"" + "RedUserCont" + p.UserContactId + "\">" + p.UserContactValue +
                //                            "</span><a class=\"glyphicon glyphicon-pencil " +
                //                            "redagContact\"data-toggle=\"modal\" data-target=" +
                //                            "\"#RedactUserContact-modal\" id=\"" + p.UserContactId + "RD" + "\"></a>" + "</td>";
                //UserContactsLiteral.Text += "<td id=\"" + p.UserContactId + "VC" + "\"class=";

                if (p.IsVisible == "0")
                {
                    UserContactsLiteral.Text += "\"glyphicon glyphicon-eye-open isVisible\"</td></tr>";
                }
                else
                {
                    UserContactsLiteral.Text += "\"glyphicon glyphicon-eye-close isVisible\"</td></tr>";
                }

            }
            var contactsType = CampusClient.GetAllContactTypes();
            foreach (var v in contactsType)
            {
                if (!CurrentUser.Contacts.ToList().Exists(contact => contact.ContactTypeName == v.Name))
                {
                    ListTypeContact.Items.Add(v.Name);
                }
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
            if (ttList.Count() > 0)
            {
                //цикл по тижням навчання
                for (int w = 0; w < 2; w++)
                {
                    TimeTablesLiteral.Text += "<h5 align=\"center\"> " + (w + 1) + "-й тиждень</h5>" +
                   "  <table class=\"table table-bordered table-hover\"><tr><td></td><td>Понеділок</td><td>Вівторок</td><td>Середа</td>" +
                   "<td>Четвер</td><td>П'ятниця</td><td>Субота</td></tr>";
                    //цикл по парам
                    for (int l = 0; l < 5; l++)
                    {
                        TimeTablesLiteral.Text += "<tr><td>" + (l + 1) + "</td>";
                        //цикл по дням тижня
                        for (int d = 0; d < 6; d++)
                        {
                            if (
                                !ttList.Exists(
                                    table =>
                                        //якщо нумерація тижнів, пар і днів тижня з нуля то +1
                                        table.WeekNum == w && table.LessonId == l &&
                                        table.DayId == d))
                            {
                                TimeTablesLiteral.Text += "<td></td>";
                            }
                            else
                            {
                                var lesson = ttList.SingleOrDefault(
                                    table =>
                                        //якщо нумерація тижнів, пар і днів тижня з нуля то +1
                                        table.WeekNum == w &&
                                        table.LessonId == l &&
                                        table.DayId == d);
                                TimeTablesLiteral.Text += "<td>" + lesson.Subject + "<br>" +
                                                          lesson.Employee + "<br>" + lesson.Building
                                                          + "<br>" + lesson.GroupName + "<br>" +
                                                          lesson.TimeLesson + "</td>" + "</td>";
                            }
                        }
                        TimeTablesLiteral.Text += "</tr>";
                    }
                    TimeTablesLiteral.Text += "</table><br><br>";
                }
            }

            SpecFunc.Text += "<table class=\"table table-hover table-fill\">" +
                "<tr><th><strong>Вид підсистеми</strong></th><th><strong>Роль в підсистемі</strong></th></tr>";
            foreach (var p in CurrentUser.Profiles)
            {
                SpecFunc.Text += "<tr><td>" + p.SubsystemName + "</td>";
                SpecFunc.Text += "<td>" + p.ProfileName + "</td></tr>";
            }

            SpecFunc.Text += "</table>";
            var credo = CampusClient.GetUserCredo(SessionId);
            if (credo != null)
            {
                CredoLiteral.Text += "<h4 class=\"UserCredo\">Кредо '" + credo + "' " +
                                     "<span class=\"glyphicon glyphicon-pencil\" id=\"CredoUpdate\" " +
                                     "data-toggle=\"modal\" data-target=\"#ChangeCredo-modal\" >" +
                                     "</span></h4>";
            }
            //якщо немає то стандарне повідомлення вказати кредо
            else
            {
                CredoLiteral.Text += "<h6 class=\"UserCredo\"><a data-toggle=\"modal\" " +
                                     "data-target=\"#ChangeCredo-modal\">Вкажіть Ваше кредо </a></h6>";
            }
        }
        public void btnFailure_Click(object sender, EventArgs e)
        {
            if (CampusClient.SetReasonFailure(SessionId, ReasonTextBox.Text))
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "Ви <strong> не дозволили розміщення</strong> вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет. Ви відмовились по причині:" +
                                           "<br>" + ReasonTextBox.Text + "</div></div>";
                //kostilik
                CurrentUser.IsConfirmed = "0";
                CurrentUser.ReasonFailure = ReasonTextBox.Text;
                btnConfirm.CssClass = "btn btn-primary";
                btnDenie.CssClass = "btn btn-primary disabled";
            }
            else
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "Сталася помилка, спробудуйте пізніше" +
                                           "</div></div>";
            }
            //UpdPan.Update();
        }

        public void btnConfirm_Click(object sender, EventArgs e)
        {
            if (CampusClient.IsConfirmSet(SessionId))
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-info alert-dismissable\">" +
                                           "Ви <strong> дозволили розміщення</strong> вашої персональної інформації на сайті " +
                                           "intellect.kpi.ua в мережі Інтернет." +
                                           "</div></div>";
                //kostilik
                CurrentUser.IsConfirmed = "1";
                CurrentUser.ReasonFailure = null;
                btnConfirm.CssClass = "btn btn-primary disabled";
                btnDenie.CssClass = "btn btn-primary";
            }
            else
            {
                MessegeIsConfirmed.Text = "<div class=\"form-group\">" +
                                           "<div class=\"alert alert-danger alert-dismissable\">" +
                                           "Сталася помилка, спробудуйте пізніше" +
                                           "</div></div>";
            }
            //UpdPan.Update();
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

            if (NewPass.Text == NewPassCheak.Text)
            {
                if (CampusClient.ChangePassword(SessionId, OldPass.Text, NewPass.Text))
                {
                    ShowErrorMessage("OK");
                }
                else
                {
                    ShowErrorMessage("Старий пароль неправильний");
                }
            }
            else
            {
                ShowErrorMessage("Новий пароль не співпав");
            }

        }

        private void ShowErrorMessage(string text)
        {
            //error_message.Visible = true;
            //error_message_text.InnerText = text;
        }

        protected void btnUploadUserFoto_Click(object sender, EventArgs e)
        {
            if (UserFotoFileUpload.HasFile)
            {
                using (var binaryReader = new BinaryReader(UserFotoFileUpload.PostedFile.InputStream))
                {
                    var fileData = binaryReader.ReadBytes(UserFotoFileUpload.PostedFile.ContentLength);
                    CampusClient.UploadUserProfileImage(fileData);
                }
            }
            else
            {
                //error dont switch file
            }
        }

        protected void BtnChangeCredo_Click(object sender, EventArgs e)
        {
            if (NewUserCredoTextBox.Text != "")
            {
                CredoLiteral.Text = "<h4 class=\"UserCredo\">Кредо '" + NewUserCredoTextBox.Text + "' " +
                                     "<span class=\"glyphicon glyphicon-pencil\" id=\"CredoUpdate\" " +
                                     "data-toggle=\"modal\" data-target=\"#ChangeCredo-modal\" >" +
                                     "</span></h4>";
                CampusClient.SetUserCredo(SessionId, NewUserCredoTextBox.Text);
            }
            else
            {
                //error
            }
        }

        protected void AddUserContact_Click(object sender, EventArgs e)
        {
            if (ListTypeContact.SelectedValue != "" && UserContactValue.Text != "" && ReceptionHoursValue.Text != "")
            {
                string isVisible = IsVisibleCB.Checked ? "1" : "0";
                int newContactId = CampusClient.AddUserContactRetContactId(SessionId, ListTypeContact.SelectedValue,
                    UserContactValue.Text,
                    isVisible,
                    ReceptionHoursValue.Text);
                if (newContactId > 0)
                {
                    NewUserContactLiteral.Text += "<tr><td id=\"RedUserCont" + newContactId + "\">" + ListTypeContact.SelectedValue + "</td>";
                    NewUserContactLiteral.Text += "<td>" + UserContactValue.Text + "  <a class=\"glyphicon glyphicon-pencil " +
                                            "redagContact\"data-toggle=\"modal\" data-target=\"#RedactUserContact-modal\"" +
                                                  "id=\"" + newContactId + "RD" + "\"></a></td>";
                    NewUserContactLiteral.Text += "<td id=\"" + newContactId + "VC" + "\"class=";

                    if (isVisible == "0")
                    {
                        NewUserContactLiteral.Text += "\"glyphicon glyphicon-eye-open isVisible\"</td></tr>";
                    }
                    else
                    {
                        NewUserContactLiteral.Text += "\"glyphicon glyphicon-eye-close isVisible\"</td></tr>";
                    }
                }
            }
        }

    }
}