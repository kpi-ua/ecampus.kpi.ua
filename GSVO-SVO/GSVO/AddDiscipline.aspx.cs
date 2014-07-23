using System;
using System.Data.SqlClient;
using System.Web.Configuration;

namespace WebApplication1
{
    public partial class AddDiscipline : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            
            this.actuality.Items.Add("Актуальна");
            this.actuality.Items.Add("Неактуальна");

            actuality.SelectedIndex = 0;
        }

        private void ClearAllFields()
        {
            discName.Text = null;
            //SearchResult.Items.Clear();
            ShortName.Text = null;
            Abbre.Text = null;
            actuality.SelectedIndex = 0;
        }

        protected void Cancel_Click(object sender, EventArgs e)
        {
            ClearAllFields();
            Response.Redirect("SearchDiscipline.aspx");
        }

        private void InserDcDiscipline(string DiscName, string NameShort, string Abbreviation, string act)
        {
           string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            SqlCommand command = connection.CreateCommand();

            command.CommandText = "Insert Into DcDiscipline (Name, NameShort, Abbreviation, vcActuality, vcChangeDate) values('" +
                                  DiscName + "','" + NameShort + "','" + Abbreviation + "','" + act + "', SYSDATETIME())";

            command.ExecuteNonQuery();
            connection.Close();
        }

        protected void Save_btn_Click(object sender, EventArgs e)
        {
            string name = Convert.ToString(discName.Text);
            string sname = Convert.ToString(ShortName.Text);
            string abb = Convert.ToString(Abbre.Text);

            string act = actuality.SelectedIndex.ToString();

            //if (actuality.SelectedIndex == 0)
            //    act = "0";

            //if (actuality.SelectedIndex == 1)
            //    act = "1";

            InserDcDiscipline(name, sname, abb, act);

            //Перехід далі
            Response.Redirect("AddRtDiscipline.aspx");
        }
    }
}