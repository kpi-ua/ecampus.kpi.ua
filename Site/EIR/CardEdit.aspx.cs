using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;

namespace Site.EIR
{
    public partial class CardEdit : Core.SitePage
    {
        
        private string _irId;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
        
            LoadAllList();

            switch (Request.QueryString["type"])
            {
                case "add":
                    {
                        break;
                    }
                case "edit":
                    {
                        _irId = Request.QueryString["id"];
                        FillValues();
                        break;
                    }
            }


        }

        private void LoadAllList()
        {
            var data = CampusClient.GetIrPurpose();

            foreach (var id in data)
            {
                purpose_type.Items.Add(new ListItem(Convert.ToString(id.Value), id.Key));
            }

            data = CampusClient.GetIrForm();

            foreach (var item in data)
            {
                form_type.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetPublicationForm();

            foreach (var item in data)
            {
                public_form.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key));
            }
            
            data = CampusClient.GetContributionType();

            foreach (var item in data)
            {
                contribution_type.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetStamp();

            foreach (var item in data)
            {
                griff.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetCountries();

            foreach (var item in data)
            {
                grif_country.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
                org_country.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetLang();

            foreach (var item in data)
            {
                language.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetISType();

            foreach (var item in data)
            {
                is_type.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            
            data = CampusClient.GetPersonStatusType();

            foreach (var item in data)
            {
                person_type.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        private void LoadPanels()
        {
            //var serializer = new JavaScriptSerializer();

            //var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributors");
            //var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            //var Data = (Dictionary<string, Object>)respDictionary["Data"];
        }

        private void FillValues()
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIr?sessionId=" + SessionId + "&id=" + _irId);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var data = (Dictionary<string, object>)respDictionary["Data"];


            name.Text = data["NameShort"].ToString();
            short_description.Text = data["Description"].ToString();
            date.Text = data["DatePublish"].ToString();
            access_begin.Text = data["DateAccessStart"].ToString();
            access_end.Text = data["DateAccessEnd"].ToString();
            doc_number.Text = data["DocNumber"].ToString();
            doc_date.Text = data["DocDate"].ToString();
            //...

            json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrExtra?sessionId=" + SessionId + "&id=" +
                                            _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>)respDictionary["Data"];

            try
            {
                public_form.SelectedValue = data["DcPublicationFormId"].ToString();
                //org_name.SelectedValue = Data["DcPublishOrgId"].ToString();
                griff.SelectedValue = data["DcStampId"].ToString();
                griff_org_name.SelectedValue = data["DcStampOrgId"].ToString();
            }
            catch (Exception)
            {
                throw new Exception("Error while loading");
            }

            long_deskription.Text = data["Title"].ToString();
            public_year.Text = data["PublicationYear"].ToString();
            page_number.Text = data["PagesQuantity"].ToString();
            edition.Text = data["Edition"].ToString();
            lib_location.Text = data["LibraryLocation"].ToString();

            /*json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetContributors?sessionId=" + SessionId + "&id=" +
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

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetIrKind");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void grif_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetCities");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                griff_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void griff_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetStampOrg?cityId=" + griff_city.SelectedValue);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                griff_org_name.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void org_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetCities");
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                org_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void org_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/GetPublishOrg?cityId=" + griff_city.SelectedValue);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var Data = (Dictionary<string, Object>)respDictionary["Data"];

            foreach (var item in Data)
            {
                org_name.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void save_Click(object sender, EventArgs e)
        {
            var serializer = new JavaScriptSerializer();

            var json =
                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIr?sessionId=" + SessionId + "&name=" +
                                            name.Text + "&description=" + short_description.Text +
                                            "&dateCreate=" + DateTime.Now + "&datePublish=" + date.Text +
                                            "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                            "&docNumber=" + doc_number.Text +
                                            "&docDate=" + doc_date.Text);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var id = (string)respDictionary["Data"];

            json =
                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIrExtra?sessionId=" + SessionId +
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
                var label = (Label)control;
                string notKpiId = "";

                if (person_accessory.SelectedValue == "no")
                {
                    var json1 =
                        CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddNotKPI?type=" +
                                                    label.Attributes["ptype"] + "&surname=" +
                                                    label.Attributes["surn"]);
                    var respDictionary1 = serializer.Deserialize<Dictionary<string, object>>(json1);
                    notKpiId = (string)respDictionary1["Data"];
                }
                //how to use eemployeeId???
                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddContributor?irId=" + id +
                                            "&contTypeId=" +
                                            label.Attributes["ctype"] + "&name=" + label.Attributes["name"] +
                                            "&notKPIId=" + notKpiId + "&contPercent=" + label.Attributes["cpart"]);
            }

        }

        private void AddExtraLengs(string id)
        {
            foreach (var control in contributors.Controls)
            {
                var label = (Label)control;

                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddExtraLang?irExtraId=" + id +
                                            "&title=" + label.Attributes["name"] +
                                            "&annotation=" + label.Attributes["annot"] + "&authors=" +
                                            label.Attributes["author"] + "&langId=" + label.Attributes["lang"] +
                                            "&keyWords=" + label.Attributes["kwords"]);
            }
        }

        protected void add_contr_Click(object sender, EventArgs e)
        {
            var personLable = new Label();
            personLable.Attributes.Add(ID, contributors.Controls.Count.ToString());
            personLable.Attributes.Add("name", person_name.Text);
            personLable.Attributes.Add("ctype", contribution_type.SelectedValue);
            personLable.Attributes.Add("cpart", contribution_part.Text);
            personLable.Attributes.Add("ptype", person_type.SelectedValue);
            personLable.Attributes.Add("surn", not_kpi_surname.Text);

            contributors.Controls.Add(personLable);
            contributors_update.Update();
        }

        protected void add_land_Click(object sender, EventArgs e)
        {
            var langLable = new Label();
            langLable.Attributes.Add(ID, languages.Controls.Count.ToString());
            langLable.Attributes.Add("lang", language.SelectedValue);
            langLable.Attributes.Add("annot", annotation.Text);
            langLable.Attributes.Add("kwords", lang_keywords.Text);
            langLable.Attributes.Add("name", lang_name.Text);
            langLable.Attributes.Add("author", lang_authors.Text);

            languages.Controls.Add(langLable);
            languages_update.Update();
        }
    }
}