using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Collections;
using System.Web.Script.Serialization;

namespace campus_new_age.Authentication
{
    public partial class Premission : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                try
                {
                    string sessionId = Session["UserData"].ToString();
                    WebClient client = new WebClient();
                    client.Encoding = System.Text.Encoding.UTF8;
                    var json = client.DownloadString("http://localhost:49945/User/GetPermissions?sessionId=" + sessionId);
                    var serializer = new JavaScriptSerializer();
                    Dictionary<string, object> respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                    ArrayList arr = (ArrayList)respDictionary["Data"];
                    Dictionary<string, object>[] darr = new Dictionary<string, object>[arr.Count];

                    for (int i = 0; i < arr.Count; i++)
                    {
                        foreach (KeyValuePair<string, object> p in (Dictionary<string, object>)arr[i])
                        {
                            string boolValue = "так";
                            if (p.Value.ToString().ToLower() == "false")
                            {
                                boolValue = "ні";
                            }
                            //switch (p.Key)
                            //{
                            //    case "SubsystemName":
                            //        {
                            //            data.Text += "<p><b>" + "\"" + p.Value + "\"" + "</b></p>";
                            //            break;
                            //        }
                            //    case "IsCreate":
                            //        {
                            //            data.Text += "<p>" + "Право на створення " + boolValue + "</p>";
                            //            break;
                            //        }
                            //    case "IsRead":
                            //        {
                            //            data.Text += "<p>" + "Право на перегляд " + boolValue + "</p>";
                            //            break;
                            //        }
                            //    case "IsUpdate":
                            //        {
                            //            data.Text += "<p>" + "Право на зміну " + boolValue + "</p>";
                            //            break;
                            //        }
                            //    case "IsDelete":
                            //        {
                            //            data.Text += "<p style=\"padding-bottom:0px;background-color: yellowgreen;\">" + "Право на видалення " + boolValue + "</p>";
                            //            break;
                            //        }
                            //    default:
                            //        {
                            //            break;
                            //        }
                            //}

                        }
                    }
                }
                catch (Exception ex)
                {
                    //data.Text = "<h1>Ошибка при загрузке страницы!!!<h1>";
                }
            }
        }
    }
}