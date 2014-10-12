using System;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using PagedList;

namespace Site.Modules.Messages
{
    public partial class Messages : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            var groupId = Convert.ToInt32(Request["GroupId"]);

            IPagedList paging;
            var messages = CampusClient.GetUserConversation(SessionId, groupId, 100500, out paging);


            DialogRendering(messages, paging);
        }

        private void DialogRendering(IList<Campus.Common.Message> messages, IPagedList paging)
        {
            DialogContainer.Controls.Clear();

            HtmlGenericControl mainDiv = new HtmlGenericControl("div");
            mainDiv.Attributes.Add("id", "mainBlock");

            HtmlGenericControl subject = new HtmlGenericControl("h4");
            subject.Attributes.Add("id", "subject");
            subject.Attributes.Add("class", "text-success");

            HtmlGenericControl messageContainerDiv = new HtmlGenericControl("div");
            mainDiv.Attributes.Add("id", "messageContainerDiv");

            mainDiv.Controls.Add(subject);
            mainDiv.Controls.Add(messageContainerDiv);
            DialogContainer.Controls.Add(mainDiv);

            for (int i = messages.Count - 1; i >= 0; i--)
            {
                AddNewMessage(messages[i]);
            }
        }

        protected void AnswerBtn_Click(object sender, EventArgs e)
        {
            Dictionary<string, object> answer = null;

            if (AnswerText.Text != "")
            {
                answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "message/SendMessage?sessionId=" + SessionId + "&groupId=" + Session["GroupId"].ToString() + "&text=" + AnswerText.Text.ToString() + "&subject=" + Session["Subject"].ToString());
            }

            if (answer != null)
            {
                AnswerText.Text = "";
                Response.Redirect("Dialog.aspx");
            }
        }

        private void AddNewMessage(Campus.Common.Message message)
        {
            HtmlGenericControl messageDiv = new HtmlGenericControl("div");
            messageDiv.Attributes.Add("class", "chat-message chat-message-info");

            HtmlGenericControl sender = new HtmlGenericControl("p");
            sender.Attributes.Add("tid", "sender");
            sender.Attributes.Add("class", "senderName text-primary");

            HtmlGenericControl text = new HtmlGenericControl("p");
            text.Attributes.Add("class", "messageText");

            HtmlGenericControl date = new HtmlGenericControl("span");
            date.Attributes.Add("class", "text-warning messageDate");

            Image senderPhoto = new Image();
            senderPhoto.Attributes.Add("class", "senderPhoto");
            senderPhoto.ImageUrl = message.SenderUserAccountPhoto;

            sender.InnerText = message.SenderUserAccountFullName;
            text.InnerText = message.Text;
            date.InnerText = message.DateSent; ;

            messageDiv.Controls.Add(date);
            messageDiv.Controls.Add(senderPhoto);
            messageDiv.Controls.Add(sender);
            messageDiv.Controls.Add(text);
            DialogContainer.Controls.Add(messageDiv);

        }
    }
}