using Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.HtmlControls;

namespace Site
{
    public partial class SiteMaster : SiteMasterPage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            try
            {
                if (SitePage.SaveIn && ((Request.Cookies["Session"] == null) || (Request.Cookies["Session"].Value == "")))
                {
                    Response.Redirect("~/Login.aspx");
                }
                else
                {
                    ExitLink.PostBackUrl = Request.Url.AbsoluteUri;
                    UserName.Text += SitePage.CurrentUser.FullName;

                    var hiddenField = new HtmlGenericControl("input");
                    hiddenField.Attributes.Add("id", "uhidden");
                    hiddenField.Attributes.Add("type", "hidden");
                    hiddenField.Attributes.Add("value", SitePage.CurrentUser.UserAccountId.ToString());

                    form.Controls.Add(hiddenField);

                    LoadCarousel();
                }

            }
            catch (Exception ex)
            {
                UserName.Text = "Ошибка при загрузке страницы!!!";
            }
        }

        private void LoadCarousel()
        {
            var sb = new StringBuilder();

            foreach (var link in this.TopLinks)
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

        protected void ExitLink_Click(object sender, EventArgs e)
        {
            if (SitePage.SaveIn)
            {
                Response.Cookies["Session"].Value = null;
            }

            Response.Redirect("~/Login.aspx");
        }

        private IEnumerable<Core.Link> TopLinks
        {
            get
            {
                return new List<Core.Link>
                    {
                        new Link {Title = "Мій профіль", Image = SitePage.CurrentUser.Photo, Url = "/Default.aspx"},
                        new Link {Title = "Дошка оголошень", Image = "/Images/carousel-billboard.jpg", Url = "/Bulletins"},
                        new Link {Title = "Спілкування", Image = "/Images/carousel-msg.jpg", Url = "/Messages"},
                        new Link {Title = "Розклад", Image = "/Images/carousel-schd.jpg" ,Url = "/TimeTable"},
                        new Link {Title = "Підтримка", Image = "/Images/carousel-support.jpg", Url = "/Support.aspx"},
                    };
            }
        }
    }
}
