using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Core;

namespace Site.Authentication
{
    public partial class AllDialogs : System.Web.UI.Page
    {
        protected void Page_Init(object sender, EventArgs e)
        {
            if (Session["UserData"] != null)
            {
                Dictionary<string, object> answer = Helper.GetData(Campus.SDK.Client.ApiEndpoint + "message/GetUserConversations?sessionId=" + Session["UserData"].ToString());
                ArrayList Data;

                if (answer != null)
                {

                    Data = (ArrayList)answer["Data"];

                    for (int i = Data.Count - 1; i >= 0; i--)
                    {
                        Dictionary<string, object> kvData = (Dictionary<string, object>)Data[i];
                        LinkButtonsRendering(kvData);
                    }
                }
            }
            else
            {
                HtmlGenericControl mainDiv = new HtmlGenericControl("div");
                Helper.CreateErrorMessage(mainDiv);
                LinkContainer.Controls.Add(mainDiv);
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {

            }

        }

        protected void messageLink_Click(object sender, EventArgs e)
        {

            LinkButton activeLink = sender as LinkButton;

            if (activeLink != null)
            {
                Session["GroupId"] = activeLink.Attributes["cId"];
                Session["imgDiv"] = activeLink.Controls[0].Controls[0];
                Session["Subject"] = activeLink.Attributes["subj"];
                Response.Redirect("Messages.aspx");
            }

        }


        public void LinkButtonsRendering(Dictionary<string, object> Data)
        {

            ArrayList Users = (ArrayList)Data["Users"];
            ArrayList UserData = new ArrayList();

            LinkButton messageLink = new LinkButton();
            HtmlGenericControl mainDiv = new HtmlGenericControl("div");
            HtmlGenericControl imgDiv = new HtmlGenericControl("div");

            HtmlGenericControl infoDiv = new HtmlGenericControl("div");
            HtmlGenericControl subject = new HtmlGenericControl("h5");
            HtmlGenericControl last = new HtmlGenericControl("p");
            Image lastPhoto = new Image();
            HtmlGenericControl lastSender = new HtmlGenericControl("h6");
            HtmlGenericControl lastText = new HtmlGenericControl("p");
            HtmlGenericControl date = new HtmlGenericControl("p");


            for (int j = 0; j < Users.Count || j > 4; j++)
            {

                Dictionary<string, object> kvUsers = (Dictionary<string, object>)Users[j];
                UserData.Add(kvUsers);

                Image ownImg = new Image();

                ownImg.ImageUrl = kvUsers["Photo"].ToString();
                imgDiv.Controls.Add(ownImg);
            }

            messageLink.PostBackUrl = Request.Url.AbsolutePath.ToString();
            messageLink.Attributes.Add("class", "messageLink");
            messageLink.Attributes.Add("cId", Data["GroupId"].ToString());
            messageLink.Attributes.Add("subj", Data["Subject"].ToString());
            messageLink.Click += messageLink_Click;

            mainDiv.Attributes.Add("id", "mainBlock");
            mainDiv.Attributes.Add("class", ".form-inline");

            imgDiv.Attributes.Add("id", "imgBlock");
            imgDiv.Attributes.Add("class", "imgBlock");
            //imgDiv.Attributes.Add("class", "col-md2");

            infoDiv.Attributes.Add("id", "infoBlock");
            //infoDiv.Attributes.Add("class", "col-md5");

            subject.Attributes.Add("id", "subject");
            subject.Attributes.Add("class", "text-primary");
            last.Attributes.Add("id", "last");
            last.Attributes.Add("class", "text-success");

            lastPhoto.Attributes.Add("class", "lastPhoto");
            lastSender.Attributes.Add("class", "lastSender text-warning");
            lastText.Attributes.Add("class", " lastText text-success");
            
            date.Attributes.Add("id", "date");
            date.Attributes.Add("class", "text-warning");

            subject.InnerText = Data["Subject"].ToString();
            for (int i = 0; i < UserData.Count; i++) {
                Dictionary<string, object> currUser = (Dictionary<string, object>)UserData[i];
                if (currUser["UserAccountId"].ToString() == Data["LastSenderUserAccountId"].ToString())
                {
                    lastSender.InnerText = currUser["FullName"].ToString();
                    lastPhoto.ImageUrl = currUser["Photo"].ToString();
                    lastText.InnerText = Data["LastMessageText"].ToString();
                }
            }
           
            date.InnerText = Data["LastMessageDate"].ToString();

           
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



        protected void NewMessage_Click(object sender, EventArgs e)
        {
            Response.Redirect("NewMessage.aspx");
        }


    }
}