using System;
using System.Data.SqlClient;
using System.Drawing;
using System.Web.Configuration;
using System.Web.SessionState;

namespace WebApplication1
{
    public partial class Login : System.Web.UI.Page
    {
        //Ініціалізуємо локальну сесію для передачі даних
        private HttpSessionState _session;

        public void LoginManaget(HttpSessionState session)
        {
            this._session = session;
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public string str;

        //По натиску кнопки відбувається валідація вводу і виклик методу перевірки присутності реєстраці користувача в базі
        protected void logIn_btn_Click(object sender, EventArgs e)
        {
            //Перевірка чи заповнені поля авторизації
            CheckLogin.Check(Login_tb, Pass_tb, ErrorMess_lbl);

            //Якщо всі поля заповнені вірно викликаємо метод перевірки реєстрації користувача
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

            //Вибірка ідентифікатора користувача і відповідності до нього паролю в таблиці UserAccount відповідно до логіна
            SqlCommand selectLoginCommand = new SqlCommand("Select password, UserAccountId From UserAccount where Login='" + Login_tb.Text + "'", connection);
           
            SqlDataReader reader = selectLoginCommand.ExecuteReader();

            //Якщо все ж корисувач присутній, перевіряємо його пароль
            if (reader.HasRows)
            {
                reader.Read();
                //зчитуємо перше значення з запиту і порівнюємо з текстом введеним в полі введення паролів
                if (reader.GetValue(0).ToString() == Pass_tb.Text)
                {
                   //якщо значення відповідають
                    //заносимо значення ідентифікатора в змінну і записуємо його в загальну сесію
                    var id = reader.GetValue(1);
                    Session["UserAccountId"] = id;
                    //Виконуємо перехід до головної сторінки
                    Response.Redirect("Home.aspx");

                    //Response.Write((string)_session["UserAccountId"].ToString());
                }
                //Якщо все погано і пароль до логіна відсутній, виводимо на мітку повідомлення    
                else
                {
                    ErrorMess_lbl.Text = " Введено невірний пароль";
                    Pass_tb.BorderColor = Color.Red;
                }
            }
            //Якщо данні не відповідають записам в таблиці, виводимо помилку на мітку
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