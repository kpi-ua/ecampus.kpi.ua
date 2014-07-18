using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    public partial class AddRtDiscipline : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ClearAll()
        {
            NormativeDisc.Text = null;
            KomponentsDropList.SelectedIndex = 0;
            ShifrDisc.Text = null;
            HoursCount.Text = null;
            NationCred.Text = null;
            CreditECTS.Text = null;
            OurCredit.Text = null;
            StatusDropList.SelectedIndex = 0;
            actualityDate.Text = null;
            ActivityDownList.SelectedIndex = 0;
            Publish.Text = null;
        }

        protected void ClearDisc_Click(object sender, EventArgs e)
        {
            ClearAll();
        }

        protected void CancelDisc_Click(object sender, EventArgs e)
        {
            ClearAll();

            Response.Redirect("AddDiscipline.aspx");
        }

        protected void SaveDisc_btn_Click(object sender, EventArgs e)
        {

        }

        protected void InsertRtDiscipline(string normDisc, string rtProfTrainTotalId, string komponent, string cycles, string shifr, string hours, string nationalC, string eCcts, string OurC, string status, string fullName, string dcDisciplineId)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();

            command.CommandText = "Insert into RtDiscipline (RtProfTrainTotalId, DcCycleId, DcComponentId, DcDisciplineId, Shifr, CountHour, CreditNational, CreditECTS, OutCredit, vcActuality, vcChangeDate, vcStatus, vcStatusDate, Description) values ('"+ rtProfTrainTotalId +"',"+ komponent +"','" + cycles + "','" + dcDisciplineId + "','" + shifr + "','" + hours + ", 1, 1, NULL, 451, '10001', 50, 12.3, 12.3, 0, 0, SYSDATETIME(), 0, SYSDATETIME(), @fName)";

            command.ExecuteNonQuery();
            connection.Close();
        }
    }
}