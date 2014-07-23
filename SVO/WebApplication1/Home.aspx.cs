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
    public partial class Home : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string userId = Session["UserAccountId"].ToString();

            UserAccountId(userId);
        }


        /// <summary>
        /// Приймаємо значення ІД з таблиці UserAccountID
        /// </summary>
        /// <param name="userAcc">Ідентифікатор користувача в таблиці UserAccount</param>
        public void UserAccountId(string userAcc)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            SqlCommand selectResponsbleCommand = new SqlCommand("Select distinct RtResponsibleId, DcSubdivisionId, DcSubSystemId From RtResponsible where UserAccountId='" + userAcc + "'and DcSubsystemId = 15", connection);
            //SqlCommand selectResponsbleCommand = new SqlCommand("select s.Name, s.DcSubdivisionId from [RtResponsible] r, [DcSubdivision] s where r.DcSubsystemId = 15 and r.UserAccountId = " + userAcc + "and r.DcSubdivisionId = s.DcSubdivisionId ORDER BY Name", connection);
            connection.Open();
            SqlDataReader reader = selectResponsbleCommand.ExecuteReader();

            List<string[]> responseList = new List<string[]>(); 

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    int i = reader.FieldCount;
                    
                    string[] values = new string[reader.FieldCount];


                    //values[i] = 
                    ListBox1.Items.Add(reader.GetValue(0).ToString());
                    //responseList.Add(values);

                    i++;

                    string subdivisionId = reader.GetValue(1).ToString();

                    //Session[""]
                }

                Session["RespID"] = responseList;


            }else
            {
                Label1.Text = "Даний користувач не є в списку відповідальних";
            }
        }

    }
}