using System;
using System.Data.SqlClient;
using System.Web.Configuration;

namespace WebApplication1
{
    public partial class SearchDiscipline : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Check_Click(object sender, EventArgs e)
        {
            SearchResult.Items.Clear();

            string discipline = Convert.ToString(discName.Text);

            GetDsDiscipline(discipline);
        }

        private void GetDsDiscipline(string dcDiscipline)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            SqlCommand selectDiscName = new SqlCommand("Select dc.Name from DcDiscipline dc where dc.Name like'%" + dcDiscipline + "%'", connection);

            SqlDataReader reader = selectDiscName.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    SearchResult.Items.Add(reader.GetString(0));
                }
            }
            else
            {
                SearchResult.Items.Add("Схожих записів не знайдено");
            }

            reader.Close();

            connection.Close();
        }

        protected void Help_btn_Click(object sender, EventArgs e)
        {
            Response.Redirect("AddDiscipline.aspx");
        }

        protected void Cancel_Click(object sender, EventArgs e)
        {
            ClearAllFields();
            Response.Redirect("GSVO.aspx");
        }

        protected void ClearAll_Click(object sender, EventArgs e)
        {
            ClearAllFields();
        }

        protected void ClearAllFields()
        {
            SearchResult.Items.Clear();
            discName.Text = null;
        }

    }
}