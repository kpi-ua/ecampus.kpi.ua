using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using Core;

namespace Site.EIR
{
    public partial class CardEditEIR : Core.SitePage
    {
        private readonly CampusClient campusClient = new CampusClient();
        private string userId;
        private string irId;

        protected void Page_Load(object sender, EventArgs e)
        {
            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId);
            var serializer = new JavaScriptSerializer();
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, object>)respDictionary["Data"];
            userId = Data["UserAccountId"].ToString();
            LoadAllList();

            switch (Request.QueryString["type"])
            {
                case "add":
                {
                    break;
                }
                case "edit":
                {
                    irId = Request.QueryString["id"];
                    FillValues();
                    break;
                }
            }


        }

        private void LoadAllList()
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrPurpose");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var id in Data)
            {
                purpose_type.Items.Add(new ListItem(id.Value,id.Key.ToString()));
            }

            //json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrFeature");
            //respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            //Data = (Dictionary<int, string>)respDictionary["Data"];

            //foreach (var item in Data)
            //{
            //    feature_type.Items.Add(new ListItem(item.Value,item.Key.ToString()));
            //}

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrForm");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                form_type.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetPublicationForm");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                public_form.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributionType");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                contribution_type.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetStamp");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                griff.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetCountries");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                grif_country.Items.Add(new ListItem(item.Value, item.Key.ToString()));
                org_country.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetLang");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                language.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetISType");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                is_type.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetPersonStatusType");
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                person_type.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        private void LoadPanels()
        {
            //var serializer = new JavaScriptSerializer();

            //var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributors");
            //var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            //var Data = (Dictionary<int, string>)respDictionary["Data"];
        }

        private void FillValues()
        {
            var serializer = new JavaScriptSerializer();

            var json =
                campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIr?sessionId=" + SessionId + "&id=" +
                                            irId);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, object>)respDictionary["Data"];


            name.Text = Data["NameShort"].ToString();
            short_description.Text = Data["Description"].ToString();
            date.Text = Data["DatePublish"].ToString();
            access_begin.Text = Data["DateAccessStart"].ToString();
            access_end.Text = Data["DateAccessEnd"].ToString();
            doc_number.Text = Data["DocNumber"].ToString();
            doc_date.Text = Data["DocDate"].ToString();
            //...

            json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrExtra?sessionId=" + SessionId + "&id=" +
                                            irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<string, object>)respDictionary["Data"];

            try
            {
                public_form.SelectedValue = Data["DcPublicationFormId"].ToString();
                //org_name.SelectedValue = Data["DcPublishOrgId"].ToString();
                griff.SelectedValue = Data["DcStampId"].ToString();
                griff_org_name.SelectedValue = Data["DcStampOrgId"].ToString();
            }
            catch (Exception)
            {
                throw new Exception("Error while loading");
            }
            long_deskription.Text = Data["Title"].ToString();
            public_year.Text = Data["PublicationYear"].ToString();
            page_number.Text = Data["PagesQuantity"].ToString();
            edition.Text = Data["Edition"].ToString();
            lib_location.Text = Data["LibraryLocation"].ToString();

            /*json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributors?sessionId=" + SessionId + "&id=" +
                                           irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            Data = (Dictionary<string, object>)respDictionary["Data"];
            */
        }

        protected void add_person_Click(object sender, EventArgs e)
        {


            //clear values
            person_accessory.SelectedValue = "yes";
            person_name.Text = "";
            contribution_part.Text = "";
        }

        protected void feature_type_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrKind");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                public_kind.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        protected void grif_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetCities");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                griff_city.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        protected void griff_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetStampOrg?cityId=" + griff_city.SelectedValue);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                griff_org_name.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        protected void org_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetCities");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                org_city.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        protected void org_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetPublishOrg?cityId=" + griff_city.SelectedValue);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<int, string>)respDictionary["Data"];

            foreach (var item in Data)
            {
                org_name.Items.Add(new ListItem(item.Value, item.Key.ToString()));
            }
        }

        protected void save_Click(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json =
                campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIr?sessionId=" + SessionId + "&name=" +
                                            name.Text + "&description=" + short_description.Text +
                                            "&dateCreate=" + DateTime.Now + "&datePublish=" + date.Text +
                                            "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                            "&docNumber=" + doc_number.Text +
                                            "&docDate=" + doc_date.Text);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var id = (string)respDictionary["Data"];

            json =
                campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIrExtra?sessionId=" + SessionId +
                                            "&irId=" + id + "&publFormId=" +
                                            public_form.SelectedValue + "&publishOrgId=" + org_name.SelectedValue +
                                            "&stampId=" + griff.SelectedValue + "&stampOrgId=" + griff_org_name +
                                            "&title=" + long_deskription.Text + "&publicYear=" + public_year.Text +
                                            "&pages=" + page_number.Text + "&edition=" + edition.Text + "&libLocation=" +
                                            lib_location.Text);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            id = (string)respDictionary["Data"];

            AddContributors(id);
            AddExtraLengs(id);

        }

        private void AddContributors(string id)
        {
            var serializer = new JavaScriptSerializer();

            foreach (var control in contributors.Controls)
            {
                var label = (Label) control;
                string notKpiId = "";

                if (person_accessory.SelectedValue == "no")
                {
                    var json1 =
                        campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddNotKPI?type=" +
                                                    label.Attributes["ptype"] + "&surname=" +
                                                    label.Attributes["surn"]);
                    var respDictionary1 = serializer.Deserialize<Dictionary<string, object>>(json1);
                    notKpiId = (string)respDictionary1["Data"];
                }
                //how to use eemployeeId???
                campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddContributor?irId=" + id +
                                            "&contTypeId=" +
                                            label.Attributes["ctype"] + "&name=" + label.Attributes["name"] +
                                            "&notKPIId=" + notKpiId + "&contPercent=" + label.Attributes["cpart"]);
            }
            
        }

        private void AddExtraLengs(string id)
        {
            var serializer = new JavaScriptSerializer();

            foreach (var control in contributors.Controls)
            {
                var label = (Label)control;

                campusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddExtraLang?irExtraId=" + id +
                                            "&title=" + label.Attributes["name"] +
                                            "&annotation=" + label.Attributes["annot"] + "&authors=" +
                                            label.Attributes["author"] + "&langId=" + label.Attributes["lang"] +
                                            "&keyWords=" + label.Attributes["kwords"]);
            }
        }

        protected void add_contr_Click(object sender, EventArgs e)
        {
            var personLable = new Label();
           personLable.Attributes.Add(ID,contributors.Controls.Count.ToString());
            personLable.Attributes.Add("name", person_name.Text);
            personLable.Attributes.Add("ctype",contribution_type.SelectedValue);
            personLable.Attributes.Add("cpart",contribution_part.Text);
            personLable.Attributes.Add("ptype", person_type.SelectedValue);
            personLable.Attributes.Add("surn",not_kpi_surname.Text);

            contributors.Controls.Add(personLable);
            contributors_update.Update();
        }

        protected void add_land_Click(object sender, EventArgs e)
        {
            var langLable = new Label();
            langLable.Attributes.Add(ID,languages.Controls.Count.ToString());
            langLable.Attributes.Add("lang", language.SelectedValue);
            langLable.Attributes.Add("annot",annotation.Text);
            langLable.Attributes.Add("kwords",lang_keywords.Text);
            langLable.Attributes.Add("name", lang_name.Text);
            langLable.Attributes.Add("author", lang_authors.Text);

            languages.Controls.Add(langLable);
            languages_update.Update();
        }
    }
}