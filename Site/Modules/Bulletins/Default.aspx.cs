using System.Linq;
using Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Site.Modules.Bulletins
{
    public partial class Default : Core.SitePage
    {

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            moderator.Visible = Permissions["Дошка оголошень"].Create;

            var items = CampusClient.GetBulletinBoard(SessionId);

            Render(items);
        }

        private void Render(IEnumerable<Campus.Common.BulletinBoard> items)
        {
            var sb = new StringBuilder();

            sb.AppendLine("<table class=\"table  table-condensed  table-hover\">");

            foreach (var item in items)
            {
                sb.AppendLine("<tr>");
                sb.AppendLine("<td>");
                sb.AppendFormat("<div class=\"date\">{0}</div>", item.DateCreate);
                sb.AppendFormat("<span class=\"poster\">{0}</span>", String.IsNullOrEmpty(item.CreatorUserFullName) ? "Анонім" : item.CreatorUserFullName);
                sb.AppendFormat("<h4 class=\"text-primary\">{0}</h4>", item.Subject);
                sb.AppendFormat("<p class=\"text-success\">{0}</p>", item.Text);
                sb.AppendLine("</td>");
                sb.AppendLine("</tr>");
            }

            sb.AppendLine("</table>");

            bulletins.InnerHtml = sb.ToString();
        }


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

        public string ToStringList<T>(IEnumerable<T> list, Func<T, string> func)
        {
            return list.Aggregate("", (current, item) => current + (func(item) + "\n"));
        }
    }

    /// <summary>
    /// Внутренний класс обьявления из доски обьявлений
    /// </summary>
    [Serializable]
    public class Bulletin
    {
        public int BulletinId = -1; // -1 указывает что объявление только создается, в противном случае оно редактируется по ИД
        public string Subject = "";
        public string Text = "";
        public string CreatorName = "";
        public int CreatorId = 0;
        public DateTime CreationDate = new DateTime(1000, 1, 1);
        public DateTime ModifiedDate = new DateTime(1000, 1, 1);
        public bool Editable = false; // Поле показывает можно ли редактировать объявление для юзера который запросил вывод этого объявления
        public int? GroupId = -1;
        public int? ProfileId = -1;
        public int? SubdivisionId = -1;
        public int? ProfilePermissionId = -1;
    }

    /// <summary>
    /// Класс отображающий информацию о типах (включает в себя уникальный ид и имя)
    /// Пример: (1, Науковець), (2, Декан), (3, Студент)...
    /// </summary>
    public class SimpleInfo
    {
        public int Id;
        public String Name;
    }
}