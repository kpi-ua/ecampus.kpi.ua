using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using Core.Doska;
using System.Runtime.Serialization;
using System.Web.Script.Serialization;
using System.Net.Http;
using System.Net.Http.Headers;


namespace Site.Bulletins
{
    public partial class Default : Core.SitePage
    {

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            
            moderator.Visible = Permissions["Дошка оголошень"].Create;
            
            var items = CampusClient.GetBulletinBoard(SessionId);

            Render(items);
        }

        private void Render(IEnumerable<Campus.Common.BulletinBoard> items)
        {
            var sb = new StringBuilder();

            sb.AppendLine("<table class=\"table  table-condensed  table-hover\">");
            
            foreach (var item in items)
            {
                sb.AppendLine("<tr>");
                sb.AppendLine("<td>");
                sb.AppendFormat("<div class=\"date\">{0}</div>", item.DateCreate);
                sb.AppendFormat("<span class=\"poster\">{0}</span>", String.IsNullOrEmpty(item.CreatorUserFullName) ? "Анонім" : item.CreatorUserFullName);
                sb.AppendFormat("<h4 class=\"text-primary\">{0}</h4>", item.Subject);
                sb.AppendFormat("<p class=\"text-success\">{0}</p>", item.Text);
                

                sb.AppendLine("</td>");
                sb.AppendLine("</tr>");
            }
            
            sb.AppendLine("</table>");

            bulletins.InnerHtml = sb.ToString();
        }


        protected void get_group_list_click(object sender, EventArgs e)
        {  
            var result = Static.MakeRequest<List<SimpleInfo>>("http://api.ecampus.kpi.ua/bulletinboard/deskgetprofiletypeslist");
            
            output_box.Text = result.ToStringList(a => "Id: "+ a.Id.ToString() + " Name: "+a.Name);        
        }
        
        protected void get_actual_click(object sender, EventArgs e)
        {
            var result = Static.MakeRequest<List<Bulletin>>("http://api.ecampus.kpi.ua/bulletinboard/deskgetactualbulletins?sessionid=bf744a02-68eb-41be-850c-36f6c5b8c926");
            output_box.Text = result.ToStringList(a => "Author: " + a.CreatorName + " Description: " + a.Text);
        }

        protected void get_faculty_list_click(object sender, EventArgs e)
        {
            var result = Static.MakeRequest<List<SimpleInfo>>("http://api.ecampus.kpi.ua/bulletinboard/deskgetfacultytypeslist");
            output_box.Text = result.ToStringList(a => "Id: " + a.Id + " Name: " + a.Name);
        }

        protected void add_buletin_click(object sender, EventArgs e)
        {
           
            string sessionId = "bf744a02-68eb-41be-850c-36f6c5b8c926";
            Bulletin b = new Bulletin();
            b.Text = input_box.Text;
            string bulletin = "sessionid="+sessionId;
            bulletin +="bulletin="+ Newtonsoft.Json.JsonConvert.SerializeObject(b);
            var a = WRequest("http://api.ecampus.kpi.ua/bulletinboard/deskaddbulletei", "POST", bulletin);
            output_box.Text = a;
        }

        public static string WRequest(string URL, string method, string postData)
          {
            string responseData = "";
            try
            {
              System.Net.HttpWebRequest hwrequest =
                (System.Net.HttpWebRequest) System.Net.WebRequest.Create(URL);
              hwrequest.Accept = "*/*";
              hwrequest.AllowAutoRedirect = true;
              hwrequest.UserAgent = "http_requester/0.1";
              hwrequest.Timeout= 60000;
              hwrequest.Method = method;
              if (hwrequest.Method == "POST")
              {
                hwrequest.ContentType = "application/x-www-form-urlencoded";
                // Use UTF8Encoding instead of ASCIIEncoding for XML requests:
                System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();
                byte[] postByteArray = encoding.GetBytes(postData);
                hwrequest.ContentLength = postByteArray.Length;
                System.IO.Stream postStream = hwrequest.GetRequestStream();
                postStream.Write(postByteArray, 0, postByteArray.Length);
                postStream.Close();
              }
              System.Net.HttpWebResponse hwresponse =
                (System.Net.HttpWebResponse) hwrequest.GetResponse();
              if (hwresponse.StatusCode == System.Net.HttpStatusCode.OK)
              {
                System.IO.Stream responseStream = hwresponse.GetResponseStream();
                System.IO.StreamReader myStreamReader =
                  new System.IO.StreamReader(responseStream);
                responseData = myStreamReader.ReadToEnd();
              }
              hwresponse.Close();
            }
            catch (Exception e)
            {
              responseData = "An error occurred: " + e.Message;
            }
            return responseData;
          }

            
    }
}