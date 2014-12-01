using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;

namespace WebApplication1
{
    public partial class GSVO : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Підтягуємо значення ідентифікаторів ГСВО через глобальну сесію
            string rtProfTrainTotalId = Session["RtProfTrainTotalId"].ToString();

            //Виклик методу вибірки значень таблиці дисциплін і занесення до нього ідентифікатора ГСВО
            SelectData(rtProfTrainTotalId);

            string gsvo = Session["GSVOSpec"].ToString();

            OKR_lbl.Text = gsvo;
        }

        //Вибірка даних і виведення в таблицю з бд
        private void SelectData(string rtProfTrainTotalId)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);
            SqlDataAdapter myCmd = new SqlDataAdapter("select Distinct c.Name, comp.Name, disc.Name, d.Shifr, d.CountHour, d.CreditNational, d.CreditECTS, d.OutCredit, d.vcActuality, d.vcChangeDate,  d.vcStatus, d.vcStatusDate, d.Description From RtDiscipline d, dcCycle c, dcComponent comp, dcDiscipline disc, RtProftrainTotal r where d.RtProftrainTotalId = " + rtProfTrainTotalId + " and d.dcDisciplineId = disc.DcDisciplineId and d.dcCycleId = c.dcCycleId and d.dcComponentId = comp.DcComponentId", connection);

            DataSet ds = new DataSet();
            myCmd.Fill(ds, "RtDiscipline");

            MyDataGrid.DataSource = ds.Tables["RtDiscipline"].DefaultView;
            
            MyDataGrid.DataBind();
        }
    }
}