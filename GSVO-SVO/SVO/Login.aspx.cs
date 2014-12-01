using System;
using System.Data.SqlClient;
using System.Drawing;
using System.Web.Configuration;
using System.Web.SessionState;

namespace WebApplication1
{
    public partial class Login : System.Web.UI.Page
    {
        private HttpSessionState _session;

        public void LoginManaget(HttpSessionState session)
        {
            this._session = session;
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public string str;

        protected void logIn_btn_Click(object sender, EventArgs e)
        {
            //Перевірка чи заповнені поля авторизації
            CheckLogin.Check(Login_tb, Pass_tb, ErrorMess_lbl);

            //Якщо всі поля заповнені вірно переходимо на наступну сторінку
            if ((Login_tb.Text.Length != 0) && (Pass_tb.Text.Length != 0))
            {
                Autorization();
            }
        }

        //Перевірка на логін і пароль
        public void Autorization()
        {
           string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();
            
            SqlCommand selectLoginCommand = new SqlCommand("Select password, UserAccountId From UserAccount where Login='" + Login_tb.Text + "'", connection);
           
            SqlDataReader reader = selectLoginCommand.ExecuteReader();

            if (reader.HasRows)
            {
                reader.Read();

                if (reader.GetValue(0).ToString() == Pass_tb.Text)
                {
                    ErrorMess_lbl.ForeColor = Color.Black;
                    ErrorMess_lbl.Text = "ID = " + reader.GetValue(1);

                    
                    var id = reader.GetValue(1);
                    Session["UserAccountId"] = id;
                    Response.Redirect("SpecialityTree.aspx");

                    //Response.Write((string)_session["UserAccountId"].ToString());
                }
                    
                else
                {
                    ErrorMess_lbl.Text = " Введено невірний пароль";
                    Pass_tb.BorderColor = Color.Red;
                }
            }
            
            else
            {
                Login_tb.BorderColor = Color.Red;
                Pass_tb.BorderColor = Color.Red;
                ErrorMess_lbl.Text = "Відмовлено в доступі.Логін і пароль введені невірно.";

                Login_tb.Text = null;
                Pass_tb.Text = null;

                Login_tb.Focus();
            }
            
            reader.Close();

            connection.Close();
        }
    }
}