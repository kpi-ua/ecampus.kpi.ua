using System;
using System.Linq;
using System.Text;
using Campus.Common;

namespace Site.Modules.Messages
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var conversations = CampusClient.GetUserConversations(SessionId);
            var sb = new StringBuilder();
            if (conversations != null)
            {
                foreach (var conversation in conversations)
                {
                    sb.AppendLine(LinkButtonsRendering(conversation));
                }
            }

            message_container.InnerHtml = sb.ToString();
        }

        private string LinkButtonsRendering(Conversation conversation)
        {
            var link = String.Format("/Modules/messages/dialog.aspx?groupid={0}", conversation.GroupId);

            var images = new StringBuilder();

            for (int j = 0; j < conversation.Users.Count() && j < 4; j++)
            {
                var user = conversation.Users.ElementAt(j);
                images.AppendFormat("<img src=\"{0}\" />", user.Photo);
            }

            var lastSender = String.Empty;
            var lastPhoto = String.Empty;
            var lastText = String.Empty;

            for (int i = 0; i < conversation.Users.Count(); i++)
            {
                var currUser = conversation.Users.ElementAt(i);

                if (currUser.UserAccountId == conversation.LastSenderUserAccountId)
                {
                    lastSender = currUser.FullName;
                    lastPhoto = currUser.Photo;
                    lastText = conversation.LastMessageText;
                }
            }

            var sb = new StringBuilder();
            sb.AppendFormat(@"
            <a href=""{6}"" class=""list-item list-item-info"">
                <h4>{0}</h4>
                <div class=""image-block"">{1}</div>                
                <div id=""last"" class=""list-item-content text-success"">
                    <img class=""lastPhoto"" src=""{2}"" />
                    <h6 class=""lastSender text-warning"">{3}</h6>    
                    <p class=""lastText text-success"">{4}</p>
                    <p class=""text-warning"">{5}</p>
                </div>
                <div class=""clear""></div>
            </a>", conversation.Subject, images, lastPhoto, lastSender, lastText, conversation.LastMessageDate.ToString("f"), link);

            return sb.ToString();
        }
    }
}