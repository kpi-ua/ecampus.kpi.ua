using System;
using System.CodeDom.Compiler;
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
        public string eEmployeeId { get; set; }
        public string DataBaseId { get; set; }
        public string FullName { get; set; }
        public string ContributionType { get; set; }
        public string ContributionPart { get; set; }
        public string Status { get; set; }
    }

    internal class ExtraLanguage
    {
        public int Id { get; set; }
        public string DataBaseId { get; set; }
        public string LangId { get; set; }
        public string LangText { get; set; }
        public string Annot { get; set; }
        public string KeyWords { get; set; }
        public string Name { get; set; }
        public string Authors { get; set; }
    }


    /// <summary>
    /// for edit is needed Session["EirEdit"] & Session["EirId"]
    /// </summary>
    public partial class CardEdit : Core.SitePage
    {
        
        private string _irId;
        JavaScriptSerializer serializer = new JavaScriptSerializer();

        static List<Contributor> contributorlist = new List<Contributor>();
        static List<ExtraLanguage> extralangaugelist = new List<ExtraLanguage>(); 

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if(Page.IsPostBack) return;
        
            LoadAllList();

            if ((string) Session["EirEdit"] == "true")
            {
                _irId = (string) Session["EirId"];
                FillValues();
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

            grif_country_SelectedIndexChanged(null, null);
            griff_city_SelectedIndexChanged(null, null);

            org_country_SelectedIndexChanged(null, null);
            org_city_SelectedIndexChanged(null, null);
        }

        private void FillValues()
        {

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
                PersonEnable();
                idcontr.Text = "";
                add_contr.Text = "Додати";
            }
            else
            {
                int id = 1;
                if (contributorlist.Count != 0)
                {
                    id = contributorlist[contributorlist.Count - 1].Id + 1;
                }

                contributorlist.Add(new Contributor
                {
                    Id = id,
                    NotKpi = person_accessory.SelectedValue == "no",
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

        protected void PersonEnable()
        {
            person_accessory.Enabled = true;
            person_name.Enabled = true;
            contribution_type.Enabled = true;
            contribution_part.Enabled = true;
            person_type.Enabled = true;
            not_kpi_surname.Enabled = true;
        }

        protected void delete_person_Click(object sender, EventArgs e)
        {
            PersonEnable();
            delete_contr.Visible = false;
            var contr = contributorlist.Find(o => o.Id.Equals(Convert.ToInt32(idcontr.Text)));
            if (contr.DataBaseId != null)
            {
                //delete
            }
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

        protected void contributorsgrid_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            delete_contr.Visible = true;
            add_contr.Text = "Створити";
            var num = Convert.ToInt32(contributorsgrid.SelectedRow.Cells[0].Text);
            idcontr.Text = num.ToString();
            var cont = contributorlist.Find(o => o.Id == num);
            person_accessory.SelectedValue = cont.NotKpi ? "no" : "yes";
            person_accessory.Enabled = false;
            person_name.Text = cont.FullName;
            person_name.Enabled = false;
            contribution_type.SelectedValue = cont.ContributionType;
            contribution_type.Enabled = false;
            contribution_part.Text = cont.ContributionPart;
            contribution_part.Enabled = false;
            person_type.SelectedValue = cont.Status;
            person_type.Enabled = false;
            not_kpi_surname.Text = cont.FullName;
            not_kpi_surname.Enabled = false;
            UpdatePanel3.Update();
        }

        protected void GridLoad(object sender, EventArgs e)
        {
            contributorsgrid.DataSource = contributorlist;
            contributorsgrid.DataBind();
            contributors_update.Update();
        }


        //ExtraLangs

        protected void add_lang_Click(object sender, EventArgs e)
        {
            if (idlang.Text != "")
            {
                LangEnable();
                idlang.Text = "";
                add_land.Text = "Додати";
            }
            else
            {
                int id = 1;
                if (extralangaugelist.Count != 0)
                {
                    id = extralangaugelist[extralangaugelist.Count - 1].Id + 1;
                }

                extralangaugelist.Add(new ExtraLanguage
                {
                    Id = id,
                    LangId = language.SelectedValue,
                    LangText = language.SelectedItem.Text,
                    Annot = annotation.Text,
                    KeyWords = lang_keywords.Text,
                    Name = lang_name.Text,
                    Authors = lang_authors.Text

                });
            }

            EXGridLoad(sender, e);

            //clear values
            delete_lang.Visible = false;
            language.SelectedValue = null;
            annotation.Text = "";
            lang_keywords.Text = "";
            lang_name.Text = "";
            lang_authors.Text = "";
        }

        protected void LangEnable()
        {
            language.Enabled = true;
            annotation.Enabled = true;
            lang_keywords.Enabled = true;
            lang_name.Enabled = true;
            lang_authors.Enabled = true;

        }

        protected void delete_lang_Click(object sender, EventArgs e)
        {
            delete_contr.Visible = false;
            var lang = extralangaugelist.Find(o => o.Id.Equals(Convert.ToInt32(idlang.Text)));
            if (lang.DataBaseId != null)
            {
                //delete
            }
            extralangaugelist.Remove(lang);

            EXGridLoad(sender, e);

            idlang.Text = "";
            add_land.Text = "Додати";
            language.SelectedValue = null;
            annotation.Text = "";
            lang_keywords.Text = "";
            lang_name.Text = "";
            lang_authors.Text = "";
        }

        protected void langgrid_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            delete_lang.Visible = true;
            add_land.Text = "Створити";
            var num = Convert.ToInt32(langgrid.SelectedRow.Cells[0].Text);
            idlang.Text = num.ToString();
            var lang = extralangaugelist.Find(o => o.Id == num);
            language.SelectedValue = lang.LangId;
            language.Enabled = false;
            annotation.Text = lang.Annot;
            annotation.Enabled = false;
            lang_keywords.Text = lang.KeyWords;
            lang_keywords.Enabled = false;
            lang_name.Text = lang.Name;
            lang_name.Enabled = false;
            lang_authors.Text = lang.Authors;
            lang_authors.Enabled = false;
            langtextupdate.Update();
        }

        protected void EXGridLoad(object sender, EventArgs e)
        {
            langgrid.DataSource = extralangaugelist;
            langgrid.DataBind();
            language_update.Update();
        }

        #endregion

        protected void feature_type_SelectedIndexChanged(object sender, EventArgs e)//узнать зависимость
        {
            //var data = CampusClient.GetKind();

            //foreach (var item in data)
            //{
            //    public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            //}
        }

        #region Save Operations

        protected void save_Click(object sender, EventArgs e)
        {
            if (_irId != null)
            {
                var json =
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/UpdateIr?sessionId=" + SessionId + 
                                                "&irId=" + _irId + "&name=" +
                                                name.Text + "&description=" + short_description.Text +
                                                "&dateCreate=" + date.Text + "&datePublish=" + DateTime.Now +
                                                "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + doc_date.Text + "&dcIrFormId=" + form_type.SelectedValue +
                                                "&dcIrKindId=" +
                                                public_kind.SelectedValue + "&dcIrPurposeId=" +
                                                purpose_type.SelectedValue + "&isPublic=" +
                                                (is_public.SelectedValue == "public" ? "true" : "false"));
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                json =
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/UpdateIrExtra?sessionId=" + SessionId +
                                                "&irId=" + _irId + "&publFormId=" +
                                                public_form.SelectedValue + "&publishOrgId=" + org_name.SelectedValue +
                                                "&stampId=" + griff.SelectedValue + "&stampOrgId=" + griff_org_name +
                                                "&title=" + long_deskription.Text + "&publicYear=" + public_year.Text +
                                                "&pages=" + page_number.Text + "&edition=" + edition.Text +
                                                "&libLocation=" +
                                                lib_location.Text);

                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                AddContributors(_irId);
                AddExtraLengs(_irId);
            }
            else
            {
                var json =
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIr?sessionId=" + SessionId +
                                                "&name=" +
                                                name.Text + "&description=" + short_description.Text +
                                                "&dateCreate=" + date.Text + "&datePublish=" + DateTime.Now +
                                                "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + doc_date.Text + "&dcIrFormId=" + form_type.SelectedValue +
                                                "&dcIrKindId=" +
                                                public_kind.SelectedValue + "&dcIrPurposeId=" +
                                                purpose_type.SelectedValue + "&isPublic=" +
                                                (is_public.SelectedValue == "public" ? "true" : "false"));
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var id = (string) respDictionary["Data"];

                json =
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddIrExtra?sessionId=" + SessionId +
                                                "&irId=" + id + "&publFormId=" +
                                                public_form.SelectedValue + "&publishOrgId=" + org_name.SelectedValue +
                                                "&stampId=" + griff.SelectedValue + "&stampOrgId=" + griff_org_name +
                                                "&title=" + long_deskription.Text + "&publicYear=" + public_year.Text +
                                                "&pages=" + page_number.Text + "&edition=" + edition.Text +
                                                "&libLocation=" +
                                                lib_location.Text);

                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                AddContributors(id);
                AddExtraLengs(id);

            }
        }

        private void AddContributors(string id)
        {
            if (_irId == null)
            {
                var json =
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" +
                                                SessionId);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var userid = ((Dictionary<string, object>) respDictionary["Data"])["UserAccountId"].ToString();

                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddContributor?sessionId=" +
                                            SessionId + "&irId=" + id +
                                            "&contTypeId=1&contPercent=100&notKPI=false&userAcountId=" + userid);
            }

            foreach (var cont in contributorlist)
            {
                if (cont.DataBaseId == null)
                {
                    CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddContributor?sessionId=" +
                                                SessionId + "&irId=" + id + "&contTypeId=" +
                                                cont.ContributionType + "&contPercent=" +
                                                cont.ContributionPart + "&notKPI=" +
                                                cont.NotKpi +
                                                "&eEmployeeId=" + cont.eEmployeeId + "&name" + cont.FullName + "&status" +
                                                cont.Status);
                }
            }
        }

        private void AddExtraLengs(string id)
        {
            foreach (var lang in extralangaugelist)
            {
                CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Ir/AddExtraLang?irId=" + id +
                                            "&title=" + lang.Name +
                                            "&annotation=" + lang.Annot + "&authors=" +
                                            lang.Authors + "&langId=" + lang.LangId +
                                            "&keyWords=" + lang.KeyWords);
            }
        }
  
        #endregion 

        #region Loading Dependencies

        protected void grif_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            griff_city.Items.Clear();

            var Data = CampusClient.GetCities(grif_country.SelectedValue);

            foreach (var item in Data)
            {
                griff_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }

            griff_city_SelectedIndexChanged(sender, e);
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

        protected void org_country_SelectedIndexChanged(object sender, EventArgs e)
        {
            org_city.Items.Clear();
            var Data = CampusClient.GetCities(org_country.SelectedValue);

            foreach (var item in Data)
            {
                org_city.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }

            org_city_SelectedIndexChanged(sender, e);
        }

        protected void org_city_SelectedIndexChanged(object sender, EventArgs e)
        {
            org_name.Items.Clear();
            var Data = CampusClient.GetPublishOrg(org_city.SelectedValue);

            foreach (var item in Data)
            {
                org_name.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        #endregion

    }
}