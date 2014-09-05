using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    
    public partial class GSVO : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {


            string rtProfTrainTotalId = Session["RtProfTrainTotalId"].ToString();


            //lbel1.Text = rtProfTrainTotalId;

            string subDiv = Session["DcSubdivisionId"].ToString();

            //lbl2.Text = subDiv;
            
            SelectData(rtProfTrainTotalId);


            SelectData1(subDiv, rtProfTrainTotalId);

            string gsvo = Session["GSVOSpec"].ToString();

          //  string spec = Session["DcSubdivisionName"].ToString();

          //  lbl2.Text = gsvo;
        }

        private void SelectData(string rtProfTrainTotalId)
        {
            //string rtProfTrainTotalId = Session["RtProfTrainTotalId"].ToString();
            
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);
            SqlDataAdapter myCmd = new SqlDataAdapter("select Distinct c.Name as 'Цикл', comp.Name as 'Компонент', disc.Name as 'Нормативна дисципліна', d.Shifr as 'Шифр', d.CountHour as 'Кіл-ть годин', d.CreditNational as 'Нац. кредити', d.CreditECTS as 'Кредити ECTS', d.OutCredit as 'Позакредитна ВД', d.vcActuality as 'Актуальність', d.vcChangeDate as 'Дата актуальності',  d.vcStatus as 'Статус', d.vcStatusDate as 'Дата зміни стану', d.Description as 'Публікатор' From RtDiscipline d, dcCycle c, dcComponent comp, dcDiscipline disc, RtProftrainTotal r where d.RtProftrainTotalId = " + rtProfTrainTotalId + " and d.dcDisciplineId = disc.DcDisciplineId and d.dcCycleId = c.dcCycleId and d.dcComponentId = comp.DcComponentId", connection);

            DataSet ds = new DataSet();
            myCmd.Fill(ds, "RtDiscipline");

            GridView1.DataSource = ds.Tables["RtDiscipline"].DefaultView;
            GridView1.DataBind();
        }

        private void SelectData1(string DcSubdivisionID, string rtProfTrainTotalId)
        {
            //string rtProfTrainTotalId = Session["RtProfTrainTotalId"].ToString();
            //string rtProfTrainTotalSubdivisionId = Session["RtProfTrainTotalSubdivisionId"].ToString();

            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);
            SqlDataAdapter myCmd = new SqlDataAdapter("select Distinct c.Name as 'Цикл', comp.Name as 'Компонент', disc.Name as 'Варіативна дисципліна', d.Shifr as 'Шифр', d.CountHour as 'Кіл-ть годин', d.CreditNational as 'Нац. кредити', d.CreditECTS as 'Кредити ECTS', d.OutCredit as 'Позакредитна ВД', d.vcActuality as 'Актуальність', d.vcChangeDate as 'Дата актуальності',  d.vcStatus as 'Статус', d.vcStatusDate as 'Дата зміни стану', d.Description as 'Публікатор' From RtDiscipline d, dcCycle c, dcComponent comp, dcDiscipline disc, RtProftrainTotalSubdivision rt  where d.RtProftrainTotalSubdivisionId = rt.RtProfTrainTotalSubdivisionId and d.dcDisciplineId = disc.DcDisciplineId and d.dcCycleId = c.dcCycleId and d.dcComponentId = comp.DcComponentId and rt.RtpRofTrainTotalId=" + rtProfTrainTotalId + " and rt.DcSubdivisionId=" + DcSubdivisionID, connection);

            DataSet ds = new DataSet();
            myCmd.Fill(ds, "RtDiscipline");

            GridView2.DataSource = ds.Tables["RtDiscipline"].DefaultView;
            GridView2.DataBind();
        }

    }
}