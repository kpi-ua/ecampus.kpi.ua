using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using Core;

namespace Site.Authentication.Bulletins
{
    public partial class AllBulletins : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
        
            if (SessionId != null)
            {
                var userPremDic = (Dictionary<string, Permission>)Session["UserPremissions"];

                if (userPremDic["Дошка оголошень"].Create)
                {
                    ModeratorMode.Attributes.CssStyle.Add("display", "block");
                }
                else
                {
                    ModeratorMode.Attributes.CssStyle.Add("display", "none");
                }

                var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "BulletinBoard/GetActual?sessionId=" + SessionId);

                if (answer != null)
                {
                    var bulletins = (ArrayList)answer["Data"];
                    BulletinsRendering(bulletins);
                }
            }
            else
            {
                var mainDiv = new HtmlGenericControl("div");
                mainDiv.Attributes.Add("id", "mainBlock");
                BulletinsContainer.Controls.Add(mainDiv);
                CreateErrorMessage(mainDiv);
            }

        }

        private void BulletinsRendering(ArrayList bulletins)
        {
            for (int i = 0; i < bulletins.Count; i++)
            {
                var kvBulletin = (Dictionary<string, object>)bulletins[i];
                BulletinsContainer.Controls.Add(BulletinBlockRendering(kvBulletin));
            }
        }

        private HtmlGenericControl BulletinBlockRendering(Dictionary<string, object> kvBulletin)
        {

            var bulletinDiv = new HtmlGenericControl("div");
            bulletinDiv.Attributes.Add("class", "inf_des");

            var dateSpan = new HtmlGenericControl("span");
            dateSpan.Attributes.Add("class", "date");
            dateSpan.InnerText = kvBulletin["DateCreate"].ToString();

            var subject = new HtmlGenericControl("h4");
            subject.Attributes.Add("class", "text-primary");
            subject.InnerText = kvBulletin["Subject"].ToString();

            var readLink = new HtmlGenericControl("a");
            readLink.Attributes.Add("class", "showText");
            readLink.InnerText = "[читати...]";

            var text = new HtmlGenericControl("p");
            text.Attributes.Add("class", "text-success");
            text.InnerText = kvBulletin["Text"].ToString();

            var publisher = new HtmlGenericControl("span");
            publisher.Attributes.Add("class", "poster");
            var publisherName = new HtmlGenericControl("a");
            publisherName.InnerText = kvBulletin["CreatorUserFullName"] == null ? "Анонім" : kvBulletin["CreatorUserFullName"].ToString();
            publisher.Controls.Add(publisherName);

            bulletinDiv.Controls.Add(dateSpan);
            bulletinDiv.Controls.Add(subject);
            //bulletinDiv.Controls.Add(readLink);
            bulletinDiv.Controls.Add(text);
            bulletinDiv.Controls.Add(publisher);

            return bulletinDiv;
        }

        protected void ModearatorMode_Click(object sender, EventArgs e)
        {
            Response.Redirect("MyBulletins.aspx");
        }
    }
}