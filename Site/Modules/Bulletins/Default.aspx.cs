using Campus.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;
using Core;
using Bulletin = Core.Bulletin;

namespace Site.Modules.Bulletins
{
    public partial class Default : Core.SitePage
    {
        public static Core.Bulletin CurrentBulletin;
        private Control _baseControl;
        private Control _editControl;
        private List<SimpleInfo> _faculties;
        private List<SimpleInfo> _allowedProfile;
        public static string Result = "";

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            ScriptManager.ScriptResourceMapping.AddDefinition("jquery", new ScriptResourceDefinition
            {
                Path = "~/Scripts/jquery-2.1.1.min.js",
            });

            //moderator.Visible = Permissions["Дошка оголошень"].Create;

            //var items = CampusClient.GetBulletinBoard(SessionId);

            //Render(items);


            var list = new List<SimpleInfo>();
            list.Add(new SimpleInfo(-1, "Всі профайли"));
            foreach (var v in CampusClient.DeskGetAllowedProfiles())
                list.Add(v);
            _allowedProfile = list;
            var list2 = new List<SimpleInfo>();
            list2.Add(new SimpleInfo(-1, "Всі факультети"));
            foreach (var v in CampusClient.DeskGetFacultyTypesList())
                list2.Add(v);
            _faculties = list2;

            if (!Page.IsPostBack)
            {
                profileList.Items.Clear();
                _allowedProfile.ForEach(a => profileList.Items.Add(a.Name));
            }
            
            LoadBoard();
            
            //CampusClient.DeskGetGroupTypesList()
        }
        
        void LoadBoard()
        {
            var baseControl = new Control();
            baseControl.ID = "base_board_control";
            baseControl.Controls.Add(new LiteralControl("<div class=\"panel-group\" id=\"accordion\">"));
            int i = 0;
            foreach (var l in CampusClient.DeskGetActualBulletins(CurrentUser.UserAccountId).Reverse())
            {
                var ss = l;
                string s = l.Subject;
                string t = l.Text;
                int id = l.BulletinId;
                var b1 = new ImageButton();
                b1.ImageUrl = "/Images/delete.png";
                b1.AlternateText = "Вид";
                b1.ID = "b1_" + i;
                b1.Click += (source, args) =>
                {
                    CampusClient.DeskRemoveBulletin(id);
                    ResetBoard();
                };
                var b2 = new ImageButton();
                b2.ImageUrl = "/Images/edit.png";
                b2.AlternateText = "Ред";
                b2.ID = "b2_" + i;
                b2.Click += (source, args) =>
                {
                    CurrentBulletin = l;
                    _baseControl.Visible = false;
                    _editControl.Visible = true;
                    ((TextBox)_editControl.FindControl("board_edit_subject")).Text = l.Subject;
                    ((TextBox)_editControl.FindControl("board_edit_text")).Text = l.Text;
                    /*
                    var profDrop = ((DropDownList) _editControl.FindControl("board_prof_drop"));
                    _allowedProfile.ForEach(a => profDrop.Items.Add(a.Name));
                    profDrop.SelectedValue = (l.LinkList[0].ProfileId != null)
                        ? _allowedProfile.Find(a => a.Id == l.LinkList[0].ProfileId).Name
                        : "Всі профайли";
                    */
                    /*
                    var facultyDrop = ((DropDownList) _editControl.FindControl("board_faculty_drop"));
                    _faculties.ForEach(a => facultyDrop.Items.Add(a.Name));
                    facultyDrop.SelectedValue = (l.LinkList[0].SubdivisionId != null)
                        ? _faculties.Find(a => a.Id == l.LinkList[0].SubdivisionId).Name
                        : "Всі факультети";
                     */
                    
                };
                b1.Attributes["style"] = "float: left; margin-right: 5px;";
                b2.Attributes["style"] = b1.Attributes["style"];
                if (l.CreatorId == CurrentUser.UserAccountId)
                {
                    baseControl.Controls.Add(b1);
                    baseControl.Controls.Add(b2);
                }
                string header = "<table class=\"header-table\"><tr><td rowspan=\"2\"><div style=\"text-align: left;\">" +
                                l.Subject +
                                "</div></td>" +
                                "<td><div style=\"text-align: right;\">" +
                                l.CreationDate +
                                "(Дата створення)</div></td></tr>" +
                                "<tr>" +
                                "<td><div style=\"text-align: right;\">публікатор " +
                                l.CreatorName +
                                "</div></td></tr></table>";
                string txt = "<div class=\"panel panel-default\" style=\"margin: 10px 0px 10px 0px;\"> " +
                                "<div class=\"panel-heading\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#collapse" + i + "\">" +
                                "<h4 class=\"panel-title\">" +
                                header +
                                "</h4>" +
                                "</div>" +
                                "<div id=\"collapse" + i + "\" class=\"panel-collapse collapse \">" +
                                "<div class=\"panel-body\">" +
                                l.Text +
                                "</div></div></div>";
                baseControl.Controls.Add(new LiteralControl(txt));

                i++;
            }
            baseControl.Controls.Add(new LiteralControl("</div>"));
            _baseControl = baseControl;
            ActualBulletinDiv.Controls.Add(baseControl);

            var editControl = new Control();
            editControl.ID = "edit_board_control";

            var box1 = new TextBox();
            box1.ID = "board_edit_subject";
            box1.Width = 800;
            var box2 = new TextBox();
            box2.ID = "board_edit_text";
            box2.Width = 800;
            box2.Height = 300;
            box2.TextMode = TextBoxMode.MultiLine;
            var button1 = new Button();
            button1.ID = "board_edit_button";
            button1.Text = "Accept";
            button1.Click += ((sender, eventArgs) =>
                {
                    CampusClient.DeskUpdateBulletein(
                        CurrentUser.UserAccountId,
                        CurrentUser.FullName,
                        ((TextBox)_editControl.FindControl("board_edit_subject")).Text,
                        ((TextBox)_editControl.FindControl("board_edit_text")).Text,
                        CurrentBulletin.BulletinId,
                        CurrentBulletin.LinkList.ConvertToString()
                        );
                    ResetBoard();
                });

            var button2 = new Button();
            button2.ID = "board_cancel_button";
            button2.Text = "Cancel";
            button2.Click += ((sender, eventArgs) =>
                {
                    _editControl.Visible = false;
                    _baseControl.Visible = true;
                });

            var prof = new DropDownList();
            prof.ID = "board_prof_drop";

            //editControl.Controls.Add(prof);
            //editControl.Controls.Add(new LiteralControl("<br>"));
            editControl.Controls.Add(box1);
            editControl.Controls.Add(box2);
            editControl.Controls.Add(new LiteralControl("<br>"));
            editControl.Controls.Add(button1);
            editControl.Controls.Add(button2);
            editControl.Visible = false;
            _editControl = editControl;
            ActualBulletinDiv.Controls.Add(editControl);
        }
        
        public void ResetBoard()
        {
            ActualBulletinDiv.Controls.Clear();
            LoadBoard();
        }

        public void postRes(object sender, EventArgs e)
        {
            Result += " | " + profileList.SelectedValue;
            selectedVals.InnerText = Result;
        }

        protected void add_buletin(object sender, EventArgs e)
        {
            var list = new List<BulletinLink>();
            var split = Result.Split(new [] {" | "}, StringSplitOptions.RemoveEmptyEntries);
            Result = "";
            selectedVals.InnerText = Result;
            foreach (var s in split)
            {
                var link = new BulletinLink(-1, _allowedProfile.First(a => a.Name == s).Id, -1, -1);
                    list.Add(link);
            }
            
            var t = DateTime.Today.ToShortDateString();
            CampusClient.DeskAddBulletein(
                CurrentUser.UserAccountId,
                CurrentUser.FullName,
                DateTime.Today.ToShortDateString(),
                DateTime.Parse(dateStart_d.Text + "/" + dateStart_m.Text + "/" + dateStart_y.Text)
                    .ToShortDateString(),
                DateTime.Parse(dateEnd_d.Text + "/" + dateEnd_m.Text + "/" + dateEnd_y.Text).ToShortDateString(),
                sub_text.Text,
                text_text.Text,
                list.ConvertToString()
                );
            ResetBoard();
            
        }
        
        //<div class="panel-group" id="accordion">
        //            <div class="panel panel-default">
        //            <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne">
        //                <h4 class="panel-title">
        //                    Сообщение #1
        //                </h4>
        //            </div>
        //            <div id="collapseOne" class="panel-collapse collapse in">
        //                <div class="panel-body">
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                </div>
        //            </div>
        //            </div>
        //            <div class="panel panel-default">
        //            <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne1">
        //                <h4 class="panel-title">
        //                    Сообщение #2
        //                </h4>
        //            </div>
        //            <div id="collapseOne1" class="panel-collapse collapse">
        //                <div class="panel-body">
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                </div>
        //            </div>
        //            </div>
        //            <div class="panel panel-default">
        //            <div class="panel-heading" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne2">
        //                <h4 class="panel-title">
        //                    Сообщение #3
        //                </h4>
        //            </div>
        //            <div id="collapseOne2" class="panel-collapse collapse">
        //                <div class="panel-body">
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                    Про що сьогодні (не) домовилися Україна, Росія та Єврокомісія - людською мовою. Підсумки сьогоднішніх газових перемовин у Берліні за участю єврокомісара Гюнтера Етінгера, російського міністра енергетики Олександра Новака та його українського візаві Юрія Продана стала топ-новиною сьогоднішнього вечора. Втім, практично жодне зі ЗМІ, яке поспішило оприлюднити повідомлення цю тему (як правило - із сенсаційним заголовком), не змогло коректно передати зміст того, про що домовилися (точніше, не домовилися) три сторони сьогодні в Берліні.
        //                </div>
        //            </div>
        //            </div>
        //        </div>

        /*
        protected void get_profile_type(object sender, EventArgs e)
        {
            output_box2.Text = CampusClient.DeskGetAllowedProfiles().ToStringList(info => info.Name);
        }


        protected void get_group_list_click(object sender, EventArgs e)
        {
            output_box4.Text = CampusClient.DeskGetGroupTypesList(10193).ToStringList(info => info.Name + "\n" + info.CreationYear);
        }

        protected void get_actual_click(object sender, EventArgs e)
        {
            output_box1.Text =
                CampusClient.DeskGetActualBulletins(SessionId)
                    .ToStringList(info => "Sub: " + info.Subject + "\n" + "Text: " + info.Text);
        }

        protected void get_faculty_list_click(object sender, EventArgs e)
        {
            output_box3.Text = CampusClient.DeskGetFacultyTypesList().ToStringList(info => info.Name);
        }

        protected void add_buletin_click(object sender, EventArgs e)
        {
            input_box.Text = "REQUEST RESULT: " +
                             ((CampusClient.DeskAddBulletein(SessionId, "test sub", input_box.Text) == "0")
                                 ? "Success"
                                 : "Fail");
        }


        protected void get_moderator(object sender, EventArgs e)
        {
            output_box6.Text = CampusClient.DeskIsModerator(SessionId).ToString();
        }


        /*
        protected void get_group_list_click(object sender, EventArgs e)
        {
            var result = CampusClient.MakeRequest<List<SimpleInfo>>(CampusClient.BuildUrl("bulletinboard", "deskgetprofiletypeslist"));
            output_box.Text = ToStringList(result, a => "Id: " + a.Id.ToString() + " Name: " + a.Name);
        }

        protected void get_actual_click(object sender, EventArgs e)
        {
            var result = CampusClient.MakeRequest<List<Bulletin>>(CampusClient.BuildUrl("bulletinboard", "deskgetactualbulletins", new { CampusClient.SessionId }));
            output_box.Text = ToStringList(result, a => "Author: " + a.CreatorName + " Description: " + a.Text);
        }

        protected void get_faculty_list_click(object sender, EventArgs e)
        {
            var result = CampusClient.MakeRequest<List<SimpleInfo>>(CampusClient.BuildUrl("bulletinboard", "deskgetfacultytypeslist"));
            output_box.Text = ToStringList(result, a => "Id: " + a.Id + " Name: " + a.Name);
        }

        protected void add_buletin_click(object sender, EventArgs e)
        {
            var bulletin = new Bulletin();
            bulletin.Text = input_box.Text;
            var args = String.Format("sessionid={0}bulletin={1}", CampusClient.SessionId, Newtonsoft.Json.JsonConvert.SerializeObject(bulletin));
            var url = CampusClient.BuildUrl("bulletinboard", "deskaddbulletei");
            var result = CampusClient.Request(url, "POST", args);
            output_box.Text = result;
        }

        
         */
    }
}