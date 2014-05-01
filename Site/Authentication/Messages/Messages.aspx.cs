using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Site.Authentication;
using Core;

namespace Site.Authentication
{
    public partial class Messages : Core.SitePage
    {
        protected void Page_Init(object sender, EventArgs e)
        {


        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (SessionId != null)
            {
                Dictionary<string, object> answer = null;
                ArrayList messages;
                int page;

                answer = Helper.GetData(Campus.SDK.Client.ApiEndpoint +  "message/GetUserConversation?sessionId=" + SessionId.ToString() + "&GroupId=" + Session["GroupId"].ToString() + "&size=" + 100500);

                if (answer != null)
                {
                    Dictionary<string, object> Paging = (Dictionary<string, object>)answer["Paging"];
                    messages = (ArrayList)(answer["Data"] as Dictionary<string, object>)["Messages"];
                    bool firstPage = Convert.ToBoolean(Paging["IsFirstPage"].ToString());
                    bool lastPage = Convert.ToBoolean(Paging["IsLastPage"].ToString());
                    page = Convert.ToInt32(Paging["PageNumber"].ToString());
                    DialogRendering(messages, page, lastPage, firstPage);
                }
            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                Helper.CreateErrorMessage(mainDiv);
                DialogContainer.Controls.Add(mainDiv);
            }
        }

        public Dictionary<string, object> GetData(string request)
        {
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

        public void DialogRendering(ArrayList messages, int currentPage, bool IsLast, bool IsFirst)
        {

            DialogContainer.Controls.Clear();

            int upPage = currentPage - 1;
            int downPage = currentPage + 1;

            if (IsFirst)
            {
                downPage = currentPage;
            }
            else if (IsLast)
            {
                upPage = currentPage;
            }

            HtmlGenericControl mainDiv = new HtmlGenericControl("div");
            mainDiv.Attributes.Add("id", "mainBlock");

            HtmlGenericControl imgDiv = GetImgDiv();

            HtmlGenericControl subject = new HtmlGenericControl("h4");
            subject.Attributes.Add("id", "subject");
            subject.Attributes.Add("class", "text-success");
            subject.InnerText = Session["subject"].ToString();

            HtmlGenericControl messageContainerDiv = new HtmlGenericControl("div");
            mainDiv.Attributes.Add("id", "messageContainerDiv");

            mainDiv.Controls.Add(imgDiv);
            mainDiv.Controls.Add(subject);
            mainDiv.Controls.Add(messageContainerDiv);
            DialogContainer.Controls.Add(mainDiv);

            //start cycle
            for (int i = messages.Count - 1; i >= 0; i--)
            {
                Dictionary<string, object> kvMessage = (Dictionary<string, object>)messages[i];
                AddNewMessage(kvMessage);


            }
            //stop cycle

            //LinkButton up = new LinkButton();
            //up.PostBackUrl = Request.Url.AbsolutePath.ToString();
            //up.Text = "Попередні повідомлення";
            //up.Attributes.Add("cP", upPage.ToString());
            //up.Click += up_Click;

            //LinkButton down = new LinkButton();
            //down.PostBackUrl = Request.Url.AbsolutePath.ToString();
            //down.Text = "Наступні повідомлення";
            //down.Attributes.Add("cP", downPage.ToString());
            //down.Click += down_Click;

            //messageContainerDiv.Controls.Add(up);



            //messageContainerDiv.Controls.Add(down);


        }

        private HtmlGenericControl GetImgDiv()
        {
            HtmlGenericControl imgDiv = new HtmlGenericControl("div");
            String imgDivJson = HttpUtility.UrlDecode(Session["imgDiv"].ToString());
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var imgDivDescriptor = serializer.Deserialize<ImgDivDescriptor>(imgDivJson);
            imgDiv.Attributes.Add("id", imgDivDescriptor.id);
            imgDiv.Attributes.Add("class", imgDivDescriptor.className);
            foreach (var imgSourceString in imgDivDescriptor.imgSources)
            {
                Image img = new Image();
                img.ImageUrl = imgSourceString;
                imgDiv.Controls.Add(img);
            }
            return imgDiv;
        }

        protected void AnswerBtn_Click(object sender, EventArgs e)
        {

            if (SessionId != null)
            {
                Dictionary<string, object> answer = null;

                if (AnswerText.Text != "")
                {
                    answer = Helper.GetData(Campus.SDK.Client.ApiEndpoint + "message/SendMessage?sessionId=" + SessionId + "&groupId=" + Session["GroupId"].ToString() + "&text=" + AnswerText.Text.ToString() + "&subject=" + Session["Subject"].ToString());
                }
                if (answer != null)
                {
                    AnswerText.Text = "";
                    Response.Redirect("Messages.aspx");
                }

            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                Helper.CreateErrorMessage(mainDiv);
                DialogContainer.Controls.Add(mainDiv);
            }

        }

        protected void AddNewMessage(Dictionary<string, object> kvMessage)
        {

            HtmlGenericControl container = DialogContainer.Controls[0].Controls[2] as HtmlGenericControl;

            if (container != null)
            {

                HtmlGenericControl messageDiv = new HtmlGenericControl("div");
                messageDiv.Attributes.Add("class", "messageBlock");

                HtmlGenericControl sender = new HtmlGenericControl("p");
                sender.Attributes.Add("tid", "sender");
                sender.Attributes.Add("class", "senderName text-primary");

                HtmlGenericControl text = new HtmlGenericControl("p");
                text.Attributes.Add("class", "messageText");

                HtmlGenericControl date = new HtmlGenericControl("span");
                date.Attributes.Add("class", "text-warning messageDate");

                Image senderPhoto = new Image();
                senderPhoto.Attributes.Add("class", "senderPhoto");
                senderPhoto.ImageUrl = kvMessage["SenderUserAccountPhoto"].ToString();

                
                sender.InnerText = kvMessage["SenderUserAccountFullName"].ToString();
                text.InnerText = kvMessage["Text"].ToString();
                date.InnerText = kvMessage["DateSent"].ToString();

                messageDiv.Controls.Add(date);
                messageDiv.Controls.Add(senderPhoto);
                messageDiv.Controls.Add(sender);
                messageDiv.Controls.Add(text);
                container.Controls.Add(messageDiv);
            }
        }

        private class ImgDivDescriptor
        {
            public string id { get; set; }
            public string className { get; set; }
            public List<string> imgSources { get; set; }
        }
    }
}