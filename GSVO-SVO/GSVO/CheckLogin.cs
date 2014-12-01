using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.UI.WebControls;
using System.Web.SessionState;

namespace WebApplication1
{

    public class CheckLogin
    {
        //Перевірка на введення в поля
        static public void Check(TextBox textbox1, TextBox textbox2, Label Mess)
        {

            if (textbox1.Text.Length == 0)
            {
                textbox1.BorderColor = Color.Red;
                Mess.Text = "Помилка при введенні даних авторизації";
            }
            else
            {
                textbox1.BorderColor = Color.Gray;
                Mess.Text = null;
            }

            if (textbox2.Text.Length == 0)
            {
                textbox2.BorderColor = Color.Red;
                Mess.Text = "Помилка при введенні даних авторизації";
            }
            else
            {
                textbox2.BorderColor = Color.Gray;
                Mess.Text = null;
            }
        }
    }
}