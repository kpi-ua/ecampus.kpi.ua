using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Campus.SDK;
using Core;

namespace Site.EIR
{
    public partial class CardView : Core.SitePage
    {
        private static string _irId;
        readonly JavaScriptSerializer serializer = new JavaScriptSerializer();

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (Session["EirId"] == null)
            {
                ShowError("Помилка при завантаженні сторінки.");
                return;
            }

            _irId = Session["EirId"].ToString();
            FillValues();
        }

        private void FillValues()
        {

            Client.SetCustomEndpoint("http://localhost:49945/");

            var json =
                CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIr?sessionId=" + SessionId + "&id=" + _irId);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var data = (Dictionary<string, object>) respDictionary["Data"];


            name.Text = data["NameShort"].ToString();
            short_description.Text = data["Description"].ToString();
            date.Text = data["DatePublish"].ToString();
            access_begin.Text = data["DateAccessStart"].ToString();
            access_end.Text = data["DateAccessEnd"].ToString();
            doc_number.Text = data["DocNumber"].ToString();
            doc_date.Text = data["DocDate"].ToString();
            public_kind.Text = data["DcIrKindName"].ToString();
            form_type.Text = data["DcIrFormName"].ToString();
            purpose_type.Text = data["DcIrPurposeName"].ToString();

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIrExtra?sessionId=" + SessionId + "&irId=" +
                                               _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>) respDictionary["Data"];

            public_form.Text = data["DcPublicationFormName"].ToString();
            org_name.Text = data["DcPublishOrgName"].ToString();
            griff.Text = data["DcStampName"].ToString();
            griff_org_name.Text = data["DcStampOrgName"].ToString();

            long_deskription.Text = data["TitleBibliographic"].ToString();
            public_year.Text = data["PublicationYear"].ToString();
            page_number.Text = data["PagesQuantity"].ToString();
            edition.Text = data["Edition"].ToString();
            lib_location.Text = data["LibraryLocation"].ToString();


            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIsNumber?irExtraId=" +
                                               data["IrExtraId"].ToString());
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>) respDictionary["Data"];

            if (data != null)
            {
                is_type.Text = data["typeName"].ToString();
                is_name.Text = data["name"].ToString();
            }

            json =
                CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetContributors?sessionId=" + SessionId + "&irId=" +
                                            _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var newdata = (ArrayList) respDictionary["Data"];

            foreach (var item in newdata)
            {

                var nItem = (Dictionary<string, object>) item;

                if ((bool) nItem["notKpi"])
                {
                    members.Text += nItem["surname"] + ", " + nItem["statusName"] + ", " +
                                    nItem["DcContributorTypeName"] + ", " + nItem["ContributionPercent"] + "%";
                }
                else
                {
                    members.Text += nItem["name"] + ", " +
                                    nItem["DcContributorTypeName"] + ", " + nItem["ContributionPercent"] + "%";
                }

                members.Text += "\n";

            }

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetExtraLangs?irId=" +
                                               _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            newdata = (ArrayList) respDictionary["Data"];

            foreach (var item in newdata)
            {
                var nItem = (Dictionary<string, object>) item;

                extralangs.Text += nItem["Name"] + ", " + nItem["Title"] + ", " + nItem["Annotation"] + "\n";

            }
        }

        private void ShowError(string errText)
        {
            errlabel.Text = errText;
            errpanel.Visible = true;
            errUpdate.Update();
        }
    }
}