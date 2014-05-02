using System.Linq;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Authentication
{
    public partial class Messages : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (SessionId != null)
            {
                var result = CampusClient.GetUserConversation(SessionId, Convert.ToInt32(Session["GroupId"]), 100500);

                if (result != null)
                {
                    var items = (result.Data as IEnumerable<Object>);
                    var messages = items.Cast<JObject>().ToList();

                    DialogRendering(messages, result.Paging.PageNumber, result.Paging.IsLastPage, result.Paging.IsFirstPage);
                }
            }
            else
            {
                var mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                DialogContainer.Controls.Add(mainDiv);
            }
        }

        private void DialogRendering(IList<JObject> messages, int currentPage, bool IsLast, bool IsFirst)
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

            for (int i = messages.Count - 1; i >= 0; i--)
            {
                AddNewMessage(messages[i]);
            }
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
                    answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "message/SendMessage?sessionId=" + SessionId + "&groupId=" + Session["GroupId"].ToString() + "&text=" + AnswerText.Text.ToString() + "&subject=" + Session["Subject"].ToString());
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
                CreateErrorMessage(mainDiv);
                DialogContainer.Controls.Add(mainDiv);
            }

        }

        private void AddNewMessage(JObject kvMessage)
        {
            var container = DialogContainer.Controls[0].Controls[2] as HtmlGenericControl;

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