using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Campus.Common;

namespace Site.Modules.SubSystems.GSVO
{
    public partial class SearchDiscipline : Core.SitePage
    {
        public string[] discipline;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["SubdivisionName"] != null && Session["GSVOSpec"] != null)
                {
                    Cath.Text += " <h4 class=\"text-success\">" + Session["SubdivisionName"] + "</h4>";
                    Spec.Text += "<i class=\"text-success\">" + Session["GSVOSpec"] + "</i>";
                }
            }

            List<Campus.Common.DcDiscipline> disciplines = new List<DcDiscipline>();

            disciplines = CampusClient.GetDcDisciplines(SessionId, "");
            int dn = disciplines.Count();

            discipline = new string[dn];

            for (int i = 0; i < disciplines.Count(); i++)
            {
                discipline[i] = disciplines[i].Name;
            }
        }

        protected void DisciplineList_OnLoad(object sender, EventArgs e)
        {
            
        }

        protected void DisciplineList_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            
        }
    }
}