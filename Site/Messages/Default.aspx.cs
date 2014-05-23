using System;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Campus.Common;

namespace Site.Messages
{
    public partial class Default : Core.SitePage
    {
        protected void Page_Init(object sender, EventArgs e)
        {
            if (SessionId != null)
            {
                var conversations = CampusClient.GetUserConversations(SessionId);

                if (conversations != null)
                {
                    foreach (var conversation in conversations)
                    {
                        LinkButtonsRendering(conversation);
                    }
                }
            }
            else
            {
                var mainDiv = new HtmlGenericControl("div");
                CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }
        }

        private void LinkButtonsRendering(Conversation conversation)
        {
            var messageLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var imgDiv = new HtmlGenericControl("div");

            var infoDiv = new HtmlGenericControl("div");
            var subject = new HtmlGenericControl("h5");
            var last = new HtmlGenericControl("p");
            var lastPhoto = new Image();
            var lastSender = new HtmlGenericControl("h6");
            var lastText = new HtmlGenericControl("p");
            var date = new HtmlGenericControl("p");

            for (int j = 0; j < conversation.Users.Count() && j < 4; j++)
            {
                var user = conversation.Users.ElementAt(j);

                var ownImg = new Image();
                ownImg.ImageUrl = user.Photo;
                imgDiv.Controls.Add(ownImg);
            }

            messageLink.PostBackUrl = Request.Url.AbsolutePath;
            messageLink.Attributes.Add("class", "messageLink");


            messageLink.Attributes.Add("cId", conversation.GroupId.ToString());
            messageLink.Attributes.Add("subj", conversation.Subject);

            mainDiv.Attributes.Add("id", "mainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            imgDiv.Attributes.Add("id", "imgBlock");
            imgDiv.Attributes.Add("class", "imgBlock");

            infoDiv.Attributes.Add("id", "infoBlock");

            subject.Attributes.Add("id", "subject");
            subject.Attributes.Add("class", "text-primary");
            last.Attributes.Add("id", "last");
            last.Attributes.Add("class", "text-success");

            lastPhoto.Attributes.Add("class", "lastPhoto");
            lastSender.Attributes.Add("class", "lastSender text-warning");
            lastText.Attributes.Add("class", " lastText text-success");

            date.Attributes.Add("id", "date");
            date.Attributes.Add("class", "text-warning");

            subject.InnerText = conversation.Subject;

            for (int i = 0; i < conversation.Users.Count(); i++)
            {
                var currUser = conversation.Users.ElementAt(i);

                if (currUser.UserAccountId == conversation.LastSenderUserAccountId)
                {
                    lastSender.InnerText = currUser.FullName;
                    lastPhoto.ImageUrl = currUser.Photo;
                    lastText.InnerText = conversation.LastMessageText;
                }
            }

            date.InnerText = conversation.LastMessageDate.ToString();

            last.Controls.Add(lastPhoto);
            last.Controls.Add(lastSender);
            last.Controls.Add(lastText);
            infoDiv.Controls.Add(subject);
            infoDiv.Controls.Add(last);
            infoDiv.Controls.Add(date);
            mainDiv.Controls.Add(imgDiv);
            mainDiv.Controls.Add(infoDiv);
            messageLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(messageLink);
        }
    }
}