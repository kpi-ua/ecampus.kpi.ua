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


            var json =
                CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIr?sessionId=" + SessionId + "&id=" + _irId);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var data = (Dictionary<string, object>) respDictionary["Data"];


            name.Text = Convert.ToString(data["NameShort"]);
            short_description.Text = Convert.ToString(data["Description"]);
            date.Text = Convert.ToString(data["DatePublish"]);
            access_begin.Text = Convert.ToString(data["DateAccessStart"]);
            access_end.Text = Convert.ToString(data["DateAccessEnd"]);
            doc_number.Text = Convert.ToString(data["DocNumber"]);
            doc_date.Text = Convert.ToString(data["DocDate"]);
            public_kind.Text = Convert.ToString(data["DcIrKindName"]);
            form_type.Text = Convert.ToString(data["DcIrFormName"]);
            purpose_type.Text = Convert.ToString(data["DcIrPurposeName"]);

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIrExtra?sessionId=" + SessionId + "&irId=" +
                                               _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>) respDictionary["Data"];

            public_form.Text = Convert.ToString(data["DcPublicationFormName"]);
            org_name.Text = Convert.ToString(data["DcPublishOrgName"]);
            griff.Text = Convert.ToString(data["DcStampName"]);
            griff_org_name.Text = Convert.ToString(data["DcStampOrgName"]);

            long_deskription.Text = Convert.ToString(data["TitleBibliographic"]);
            public_year.Text = Convert.ToString(data["PublicationYear"]);
            page_number.Text = Convert.ToString(data["PagesQuantity"]);
            edition.Text = Convert.ToString(data["Edition"]);
            lib_location.Text = Convert.ToString(data["LibraryLocation"]);


            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIsNumber?irExtraId=" +
                                               data["IrExtraId"].ToString());
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>) respDictionary["Data"];

            if (data != null)
            {
                is_type.Text = Convert.ToString(data["typeName"]);
                is_name.Text = Convert.ToString(data["name"]);
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

        protected void edit_OnClick(object sender, EventArgs e)
        {
            Session["EirEdit"] = true;
            Response.Redirect("CardEdit.aspx");
        }

    }
}