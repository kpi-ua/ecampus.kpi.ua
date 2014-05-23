using System;
using System.Collections.Generic;
using System.Text;

namespace Site.Bulletins
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
    }
}