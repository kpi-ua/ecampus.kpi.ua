using System.Web.UI;
using Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.HtmlControls;

namespace Site
{
    public partial class SiteMaster : MasterPage
    {
        protected SitePage SitePage
        {
            get { return this.Page as SitePage; }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            try
            {
                if (SitePage.SaveIn && ((Request.Cookies["Session"] == null) || (Request.Cookies["Session"].Value == "")))
                {
                    Response.Redirect("~/login");
                }
                else
                {
                    UserName.Text += SitePage.CurrentUser.FullName;

                    var hiddenField = new HtmlGenericControl("input");
                    hiddenField.Attributes.Add("id", "uhidden");
                    hiddenField.Attributes.Add("type", "hidden");
                    hiddenField.Attributes.Add("value", SitePage.CurrentUser.UserAccountId.ToString());

                    form.Controls.Add(hiddenField);
                }

            }
            catch (Exception ex)
            {
                UserName.Text = "Ошибка при загрузке страницы!!!";
            }
        }

    }
}
