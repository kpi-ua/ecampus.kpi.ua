using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.EIR
{
    class Contributor
    {
        public int Id { get; set; }
        public bool NotKpi { get; set; }
        public string FullName { get; set; }
        public string ContributionType { get; set; }
        public string ContributionPart { get; set; }
        public string Status { get; set; }
    }

    class ExtraLanguage
    {
         
    }

    public partial class CardEdit : Core.SitePage
    {
        
        private string _irId;

        static List<Contributor> contributorlist = new List<Contributor>();
        static List<ExtraLanguage> extralangaugelist = new List<ExtraLanguage>(); 

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
            
            data = CampusClient.GetContributorType();

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

            data = CampusClient.GetFeature();

            foreach (var item in data)
            {
                feature_type.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }

            data = CampusClient.GetKind();

            foreach (var item in data)
            {
                public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        private void LoadPanels()
        {
            
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

        #region Adding to the panel

        //Contributors

        protected void add_person_Click(object sender, EventArgs e)
        {
            if (idcontr.Text != "")
            {
                contributorlist[Convert.ToInt32(idcontr.Text)].FullName = person_name.Text != ""
                    ? person_name.Text
                    : not_kpi_surname.Text;
                contributorlist[Convert.ToInt32(idcontr.Text)].NotKpi = person_accessory.SelectedValue == "yes";
                contributorlist[Convert.ToInt32(idcontr.Text)].ContributionPart = contribution_part.Text;
                contributorlist[Convert.ToInt32(idcontr.Text)].ContributionType = contribution_type.SelectedValue;
                contributorlist[Convert.ToInt32(idcontr.Text)].Status = person_type.SelectedValue;
                idcontr.Text = "";
                add_contr.Text = "Додати";
            }
            else
            {
                contributorlist.Add(new Contributor
                {
                    Id = contributorlist.Count,
                    NotKpi = person_accessory.SelectedValue == "yes",
                    FullName = person_name.Text != "" ? person_name.Text : not_kpi_surname.Text,
                    ContributionType = contribution_type.SelectedValue,
                    ContributionPart = contribution_part.Text,
                    Status = person_type.SelectedValue
                });
            }

            GridLoad(sender,e);

            //clear values
            delete_contr.Visible = false;
            person_accessory.SelectedValue = "yes";
            person_name.Text = "";
            contribution_part.Text = "";
            not_kpi_surname.Text = "";
        }

        protected void delete_person_Click(object sender, EventArgs e)
        {
            delete_contr.Visible = false;
            var contr = contributorlist.Find(o => o.Id.Equals(Convert.ToInt32(idcontr.Text)));
            contributorlist.Remove(contr);

            GridLoad(sender, e);

            idcontr.Text = "";
            add_contr.Text = "Додати";
            person_name.Text = "";
            person_type.SelectedValue = null;
            person_accessory.SelectedValue = "yes";
            contribution_type.SelectedValue = null;
            contribution_part.Text = "";
            not_kpi_surname.Text = "";
        }

        protected void CRowCommand(object sender, GridViewCommandEventArgs e)
        {
            delete_contr.Visible = true;
            add_contr.Text = "Зберегти";
            var num = Convert.ToInt32(e.CommandArgument);
            idcontr.Text = num.ToString();
            person_accessory.SelectedValue = contributorlist[num].NotKpi ? "yes" : "no";
            person_name.Text = contributorlist[num].FullName;
            contribution_type.SelectedValue = contributorlist[num].ContributionType;
            contribution_part.Text = contributorlist[num].ContributionPart;
            person_type.SelectedValue = contributorlist[num].Status;
            not_kpi_surname.Text = contributorlist[num].FullName;
            UpdatePanel3.Update();
        }

        protected void GridLoad(object sender, EventArgs e)
        {
            contributorsgrid.DataSource = contributorlist;
            contributorsgrid.DataBind();
            contributors_update.Update();
        }


        //ExtraLangs



        #endregion

        protected void feature_type_SelectedIndexChanged(object sender, EventArgs e)//узнать зависимость
        {
            //var data = CampusClient.GetKind();

            //foreach (var item in data)
            //{
            //    public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            //}
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

            //AddContributors(id);
            //AddExtraLengs(id);

        }

        //private void AddContributors(string id)
        //{
        //    var serializer = new JavaScriptSerializer();

        //    foreach (var control in contributors_place.Controls)
        //    {
        //        var label = (Label)control;
        //        string notKpiId = "";

        //        if (person_accessory.SelectedValue == "no")
        //        {
        //            var json1 =
        //                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddNotKPI?type=" +
        //                                            label.Attributes["ptype"] + "&surname=" +
        //                                            label.Attributes["surn"]);
        //            var respDictionary1 = serializer.Deserialize<Dictionary<string, object>>(json1);
        //            notKpiId = (string)respDictionary1["Data"];
        //        }
        //        //how to use eemployeeId???
        //        CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddContributor?irId=" + id +
        //                                    "&contTypeId=" +
        //                                    label.Attributes["ctype"] + "&name=" + label.Attributes["name"] +
        //                                    "&notKPIId=" + notKpiId + "&contPercent=" + label.Attributes["cpart"]);
        //    }

        //}

        //private void AddExtraLengs(string id)
        //{
        //    foreach (var control in contributors_place.Controls)
        //    {
        //        var label = (Label)control;

        //        CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddExtraLang?irExtraId=" + id +
        //                                    "&title=" + label.Attributes["name"] +
        //                                    "&annotation=" + label.Attributes["annot"] + "&authors=" +
        //                                    label.Attributes["author"] + "&langId=" + label.Attributes["lang"] +
        //                                    "&keyWords=" + label.Attributes["kwords"]);
        //    }
        //}

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

        


        #region Loading Dependencies

        protected void griff_city_Load(object sender, EventArgs e)
        {
            if (grif_country.SelectedValue != null)
            {
                grif_country_SelectedIndexChanged(sender, e);
            }
        }

        protected void griff_org_name_Load(object sender, EventArgs e)
        {
            if (griff_city.SelectedValue != null)
            {
                griff_city_SelectedIndexChanged(sender, e);
            }
        }

        protected void grif_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            griff_city.Items.Clear();

            var Data = CampusClient.GetCities(grif_country.SelectedValue);

            foreach (var item in Data)
            {
                griff_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void griff_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            griff_org_name.Items.Clear();
            var Data = CampusClient.GetStampOrg(griff_city.SelectedValue);

            foreach (var item in Data)
            {
                griff_org_name.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void org_city_Load(object sender, EventArgs e)
        {
            if (org_country.SelectedValue != null)
            {
                org_country_SelectedIndexChanged(sender, e);
            }
        }

        protected void org_name_Load(object sender, EventArgs e)
        {
            if (org_city.SelectedValue != null)
            {
                org_city_SelectedIndexChanged(sender, e);
            }
        }

        protected void org_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            org_city.Items.Clear();
            var Data = CampusClient.GetCities(org_country.SelectedValue);

            foreach (var item in Data)
            {
                org_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        protected void org_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            org_name.Items.Clear();
            var Data = CampusClient.GetPublishOrg(griff_city.SelectedValue);

            foreach (var item in Data)
            {
                org_name.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        #endregion


    }
}