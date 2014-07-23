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

            //Робимо вибірку з таблиці RtResponsible і отримуємо значення ідентифікатора підрозділу і ідентифікатора відповідальності за підрозділ 
            SqlCommand selectResponsbleCommand = new SqlCommand("Select distinct RtResponsibleId, DcSubdivisionId From RtResponsible where UserAccountId='" + userAcc + "'and DcSubsystemId = 15", connection);
            
            connection.Open();
            SqlDataReader reader = selectResponsbleCommand.ExecuteReader();
            //Відповідно до зчитаних значень і перевірених з значеннями в таблиці виводимо повідомлення
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    Label1.Text = "Вітаємо в системі адміністрування КБ ІС ОСВІТНЬО-ПРОФЕСІЙНОЇ ПРОГРАМИ ГСВО";
                }
            }else
            {
                Label1.Text = "Даний користувач не є в списку відповідальних";
            }
        }

    }
}