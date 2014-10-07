using System.IO;
using System.Linq;
using System.Text;
using System.Web.UI.WebControls;
using Core;
using System;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace Site
{
    public partial class SiteMaster : MasterPage
    {
        public int A;
        protected SitePage SitePage
        {
            get { return this.Page as SitePage; }
        }
        
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            try
            {
                UserName.Text = SitePage.CurrentUser.FullName;

                var hiddenField = new HtmlGenericControl("input");
                hiddenField.Attributes.Add("id", "uhidden");
                hiddenField.Attributes.Add("type", "hidden");
                hiddenField.Attributes.Add("value", SitePage.CurrentUser.UserAccountId.ToString());

                form.Controls.Add(hiddenField);

                var hiddenField1 = new HtmlGenericControl("input");
                hiddenField1.Attributes.Add("id", "sssid");
                hiddenField1.Attributes.Add("type", "hidden");
                hiddenField1.Attributes.Add("value", SitePage.SessionId);

                form.Controls.Add(hiddenField1);

               // individual_plan.Visible = SitePage.CurrentUser.Employees.Any(o => o.Position.Contains("Викладач"));
            }
            catch
            {
                UserName.Text = "Ошибка при загрузке страницы!!!";
            }
        }
        
        public void carousel_profile_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_date_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_teachers_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_methodologicalsupport_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_eip_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/EIR/IrGroup/Default.aspx");
        }

        public void carousel_plan_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/TimeTable/Default.aspx");
        }

        public void carousel_billboard_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Bulletins/Default.aspx");
        }

        public void carousel_communion_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_studygroups_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

        public void carousel_currentcontrol_button_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/Default.aspx");
        }

    }
}
