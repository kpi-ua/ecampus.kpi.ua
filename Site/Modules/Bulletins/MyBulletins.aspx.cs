using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.Bulletins
{
    public partial class MyBulletins : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "BulletinBoard/GetMyBulletins?sessionId=" + SessionId);

            if (answer != null)
            {
                var bulletins = (ArrayList)answer["Data"];
                BulletinsRendering(bulletins);
            }

        }

        private void BulletinsRendering(ArrayList bulletins)
        {
            for (int i = 0; i < bulletins.Count; i++)
            {
                var kvBulletin = (Dictionary<string, object>)bulletins[i];
                MyBulletinsContainer.Controls.Add(BulletinBlockRendering(kvBulletin));
            }
        }

        private HtmlGenericControl BulletinBlockRendering(IReadOnlyDictionary<string, object> kvBulletin)
        {
            var bulletinDiv = new HtmlGenericControl("div");
            bulletinDiv.Attributes.Add("class", "inf_des");

            HtmlGenericControl dateSpan = new HtmlGenericControl("span");
            dateSpan.Attributes.Add("class", "date");
            dateSpan.InnerText = kvBulletin["DateCreate"].ToString();

            HtmlGenericControl subject = new HtmlGenericControl("h4");
            subject.Attributes.Add("class", "text-danger");
            subject.InnerText = kvBulletin["Subject"].ToString();

            HtmlGenericControl readLink = new HtmlGenericControl("a");
            readLink.Attributes.Add("class", "showText");
            readLink.InnerText = "[редагувати...]";

            HtmlGenericControl setDiv = new HtmlGenericControl("div");
            setDiv.Attributes.Add("class", "set_des");
            HtmlGenericControl spanSubj = new HtmlGenericControl("span");
            spanSubj.Attributes.Add("class", "text-primary");
            spanSubj.InnerText = "Тема ";
            TextBox setSubj = new TextBox();
            setSubj.Attributes.Add("class", "form-control");
            setSubj.Text = kvBulletin["Subject"].ToString();
            HtmlGenericControl spanText = new HtmlGenericControl("span");
            spanText.Attributes.Add("class", "text-primary");
            spanText.InnerText = "Текст ";
            TextBox setText = new TextBox();
            setText.Attributes.Add("class", "form-control");
            setText.Text = kvBulletin["Text"].ToString();
            Button saveChanges = new Button();
            saveChanges.Text = "Зберегти зміни";
            saveChanges.CssClass = "btn btn-success btn-sm";
            setDiv.Controls.Add(spanSubj);
            setDiv.Controls.Add(setSubj);
            setDiv.Controls.Add(spanText);
            setDiv.Controls.Add(setText);
            setDiv.Controls.Add(saveChanges);

            HtmlGenericControl publisher = new HtmlGenericControl("span");
            publisher.Attributes.Add("class", "poster");
            HtmlGenericControl publisherName = new HtmlGenericControl("a");
            publisherName.InnerText = " ";
            publisher.Controls.Add(publisherName);

            bulletinDiv.Controls.Add(dateSpan);
            bulletinDiv.Controls.Add(subject);
            //bulletinDiv.Controls.Add(readLink);
            bulletinDiv.Controls.Add(setDiv);
            bulletinDiv.Controls.Add(publisher);

            return bulletinDiv;
        }
    }
}