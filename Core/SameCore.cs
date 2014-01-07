using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;

namespace Core
{
    public class SameCore
    {
        public static Dictionary<string, object> GetData(string request) {
            try
            {
                WebClient client = new WebClient();
                client.Encoding = System.Text.Encoding.UTF8;

                var json = client.DownloadString(request);
                var serializer = new JavaScriptSerializer();
                Dictionary<string, object> respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                return respDictionary;

            }
            catch (Exception ex)
            {

                return null;
            }
        }

        public static void CreateErrorMessage(HtmlGenericControl target)
        {
            target.Controls.Clear();
            HtmlGenericControl error = new HtmlGenericControl("h2");
            error.InnerText = "Помилка при завантаженні сторінки!!!";
            target.Controls.Add(error);
        }
    }
}