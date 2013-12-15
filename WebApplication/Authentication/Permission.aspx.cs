using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;

namespace WebApplication.Authentication
{
    public partial class Permission : Core.WebPage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack)
            {
                try
                {

                    var client = new Campus.SDK.Client();
                    var result = client.Get(Campus.SDK.Client.BuildUrl("User", "GetPermissions") + "?sessionId=" + SessionId);


                    var serializer = new JavaScriptSerializer();

                    var arr = result.Data as IEnumerable<dynamic>;

                    for (int i = 0; i < arr.Count(); i++)
                    {
                        foreach (KeyValuePair<string, object> p in (Dictionary<string, object>)arr.ElementAt(i))
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