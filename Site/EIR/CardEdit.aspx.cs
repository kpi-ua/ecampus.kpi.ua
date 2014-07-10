using System;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.Net.Mime;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Campus.SDK;


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
        public string ContributorFullText { get; set; }
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
        
        private static string _irId;
        readonly JavaScriptSerializer serializer = new JavaScriptSerializer();

        static List<Contributor> contributorlist = new List<Contributor>();
        static List<ExtraLanguage> extralangaugelist = new List<ExtraLanguage>(); 

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            //Client.SetCustomEndpoint("http://localhost:49945/");

            if(Page.IsPostBack) return;
        
            LoadAllList();

            if (Session["EirEdit"] != null && (bool)Session["EirEdit"])
            {
                Session["EirEdit"] = false;
                if (Session["EirId"] == null)
                {
                    ShowError("Помилка при завантаженні сторінки.");
                    return;
                }
                _irId = Session["EirId"].ToString();
                FillValues();
            }

        }

        private void ShowError(string errText)
        {
            errlabel.Text = errText;
            errpanel.Visible = true;
            errUpdate.Update();
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

            feature_type_SelectedIndexChanged(null, null);

            grif_country_SelectedIndexChanged(null, null);
            griff_city_SelectedIndexChanged(null, null);

            org_country_SelectedIndexChanged(null, null);
            org_city_SelectedIndexChanged(null, null);
        }

        private void FillValues()
        {

            var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIr?sessionId=" + SessionId + "&id=" + _irId);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var data = (Dictionary<string, object>)respDictionary["Data"];


            name.Text = Convert.ToString(data["NameShort"]);
            short_description.Text = Convert.ToString(data["Description"]);
            date.Text = Convert.ToString(data["DatePublish"]);
            access_begin.Text = Convert.ToString(data["DateAccessStart"]);
            access_end.Text = Convert.ToString(data["DateAccessEnd"]);
            doc_number.Text = Convert.ToString(data["DocNumber"]);
            doc_date.Text = Convert.ToString(data["DocDate"]);
            try
            {
                public_kind.SelectedValue = Convert.ToString(data["DcIrKindId"]);
                form_type.SelectedValue = Convert.ToString(data["DcIrFormId"]);
                purpose_type.SelectedValue = Convert.ToString(data["DcIrPurposeId"]);
            }
            catch (Exception)
            {
                throw new Exception("Error while loading");
            }

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIrExtra?sessionId=" + SessionId + "&irId=" +
                                            _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>)respDictionary["Data"];

            try
            {
                public_form.SelectedValue = Convert.ToString(data["DcPublicationFormId"]);
                org_country.SelectedValue = Convert.ToString(data["publishCountry"]);
                org_country_SelectedIndexChanged(null, null);
                org_city.SelectedValue = Convert.ToString(data["publishCity"]);
                org_city_SelectedIndexChanged(null, null);
                org_name.SelectedValue = Convert.ToString(data["DcPublishOrgId"]);
                griff.SelectedValue = Convert.ToString(data["DcStampId"]);
                grif_country.SelectedValue = Convert.ToString(data["stampCountry"]);
                grif_country_SelectedIndexChanged(null, null);
                griff_city.SelectedValue = Convert.ToString(data["stampCity"]);
                griff_city_SelectedIndexChanged(null, null);
                griff_org_name.SelectedValue = Convert.ToString(data["DcStampOrgId"]);
            }
            catch (Exception)
            {
                throw new Exception("Error while loading");
            }

            long_deskription.Text = Convert.ToString(data["TitleBibliographic"]);
            public_year.Text = Convert.ToString(data["PublicationYear"]);
            page_number.Text = Convert.ToString(data["PagesQuantity"]);
            edition.Text = Convert.ToString(data["Edition"]);
            lib_location.Text = Convert.ToString(data["LibraryLocation"]);


            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetIsNumber?irExtraId=" +
                                          data["IrExtraId"].ToString());
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            data = (Dictionary<string, object>)respDictionary["Data"];

            if (data != null)
            {
                is_type.SelectedValue = Convert.ToString(data["typeId"]);
                is_name.Text = Convert.ToString(data["name"]);
            }

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetContributors?sessionId=" + SessionId + "&irId=" +
                                           _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var newdata = (ArrayList)respDictionary["Data"];

            foreach (var item in newdata)
            {

                var nItem = (Dictionary<string, object>) item;

                contributorlist.Add(new Contributor
                {
                    DataBaseId = nItem["IrContributorId"].ToString(),
                    Id = contributorlist.Count == 0 ? 1 : contributorlist[contributorlist.Count-1].Id + 1,
                    NotKpi = Convert.ToBoolean(nItem["notKpi"]),
                    FullName = (string)nItem["surname"] == "" ? (string)nItem["name"] : (string)nItem["surname"],
                    Status = nItem["status"] != null ? nItem["status"].ToString() : null ,
                    eEmployeeId = nItem["eemployee"] != null ? nItem["eemployee"].ToString() : null,
                    ContributionPart = nItem["ContributionPercent"].ToString(),
                    ContributionType = nItem["DcContributorTypeId"].ToString()
                });
            }

            json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetExtraLangs?irId=" +
                                           _irId);
            respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            newdata = (ArrayList)respDictionary["Data"];

            foreach (var item in newdata)
            {
                var nItem = (Dictionary<string, object>) item;

                extralangaugelist.Add(new ExtraLanguage
                {
                    DataBaseId = nItem["IrExtraLangId"].ToString(),
                    Id = extralangaugelist.Count == 0 ? 1 : extralangaugelist[extralangaugelist.Count - 1].Id + 1,
                    Annot = (string)nItem["Annotation"],
                    KeyWords = (string)nItem["Keywords"],
                    Authors = (string)nItem["Authors"],
                    LangId = nItem["DcLanguageId"].ToString(),
                    LangText = (string)nItem["Name"],
                    Name = (string)nItem["Title"]
                });
            }

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

                if (contribution_type.SelectedValue == null || contribution_part.Text == "")
                {
                    ShowError("Не заповнені всі поля з зірочкою");
                    return;
                }

                if (person_accessory.SelectedValue == "yes")
                {
                    if (person_name.Text == "")
                    {
                        ShowError("Не заповнені всі поля з зірочкою");
                        return;
                    }
                }
                else
                {
                    if (person_type.SelectedValue == null || not_kpi_surname == null)
                    {
                        ShowError("Не заповнені всі поля з зірочкою");
                        return;
                    }
                }

                contributorlist.Add(new Contributor
                {
                    Id = id,
                    NotKpi = person_accessory.SelectedValue == "no",
                    FullName = person_name.Text != "" ? person_name.Text : not_kpi_surname.Text,
                    ContributionType = contribution_type.SelectedValue,
                    ContributionPart = contribution_part.Text,
                    ContributorFullText = (person_name.Text != "" ? person_name.Text : not_kpi_surname.Text) + ", " + contribution_type.SelectedItem.Text + ", " + contribution_part.Text + "%",
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
                var json =
                   CampusClient.DownloadString(Client.ApiEndpoint + "Ir/DeleteContributor?sessionId=" + SessionId +
                                               "&contributorId="+contr.DataBaseId);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
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

                if (language.SelectedValue == null)
                {
                    ShowError("Не заповнені всі поля з зірочкою");
                    return;
                }

                extralangaugelist.Add(new ExtraLanguage
                {
                    Id = id,
                    LangId = language.SelectedValue,
                    LangText = language.SelectedItem.Text,
                    Annot = annotation.Text,
                    KeyWords = lang_keywords.Text,
                    Name = lang_name.Text,
                    Authors = lang_authors.Text,

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
            LangEnable();
            delete_lang.Visible = false;
            var lang = extralangaugelist.Find(o => o.Id.Equals(Convert.ToInt32(idlang.Text)));
            if (lang.DataBaseId != null)
            {
                var json =
                   CampusClient.DownloadString(Client.ApiEndpoint + "Ir/DeleteExtraLang?sessionId=" + SessionId +
                                               "&extraLangId=" + lang.DataBaseId);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
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

        protected void feature_type_SelectedIndexChanged(object sender, EventArgs e)
        {
            var data = CampusClient.GetKind(feature_type.SelectedValue);

            public_kind.Items.Clear();

            foreach (var item in data)
            {
                public_kind.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
        }

        #region Save Operations

        protected void save_Click(object sender, EventArgs e)
        {

            if (access_begin.Text == null || public_kind.SelectedValue == null || purpose_type.SelectedValue == null ||
                is_public.SelectedValue == null || griff.SelectedValue == null || long_deskription.Text == "")
            {
                ShowError("Не заповнені всі поля з зірочкою");
                return;
            }

            if (_irId != null)
            {
                var json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "Ir/UpdateIr?sessionId=" + SessionId + 
                                                "&irId=" + _irId + "&name=" +
                                                name.Text + "&description=" + short_description.Text +
                                                "&dateCreate=" + date.Text + "&datePublish=" + DateTime.Today +
                                                "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + doc_date.Text + "&dcIrFormId=" + form_type.SelectedValue +
                                                "&dcIrKindId=" +
                                                public_kind.SelectedValue + "&dcIrPurposeId=" +
                                                purpose_type.SelectedValue + "&isPublic=" +
                                                (is_public.SelectedValue == "public" ? "1" : "0"));
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var id = respDictionary["Data"].ToString();
                if (id == "false")
                {
                    ShowError("Увага. Помилка при оновленні данних.");
                    return;
                }

                json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "Ir/UpdateIrExtra?sessionId=" + SessionId +
                                                "&irId=" + _irId + "&publFormId=" +
                                                public_form.SelectedValue + "&publishOrgId=" + org_name.SelectedValue +
                                                "&stampId=" + griff.SelectedValue + "&stampOrgId=" + griff_org_name +
                                                "&title=" + long_deskription.Text + "&publicYear=" + public_year.Text +
                                                "&pages=" + page_number.Text + "&edition=" + edition.Text +
                                                "&libLocation=" +
                                                lib_location.Text);

                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var extraId = respDictionary["Data"].ToString();
                if (extraId == "false")
                {
                    ShowError("Увага. Помилка при оновленні данних.");
                    return;
                }

                json =
                   CampusClient.DownloadString(Client.ApiEndpoint + "Ir/UpdateIsNumber?sessionId=" + SessionId +
                                               "&irId=" + _irId + "&isType=" + is_type.SelectedValue +
                                               "&isNumber=" + is_name.Text);
                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var isId = respDictionary["Data"].ToString();
                if (isId == "false")
                {
                    ShowError("Увага. Помилка при оновленні данних.");
                    return;
                }

                AddContributors(_irId);
                AddExtraLengs(_irId);

                ChangeNameFull(_irId);
            }
            else
            {
                var json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddIr?sessionId=" + SessionId +
                                                "&name=" +
                                                name.Text + "&description=" + short_description.Text +
                                                "&dateCreate=" + date.Text + "&datePublish=" + DateTime.Today +
                                                "&accessStart=" + access_begin.Text + "&accessEnd=" + access_end.Text +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + doc_date.Text + "&dcIrFormId=" + form_type.SelectedValue +
                                                "&dcIrKindId=" +
                                                public_kind.SelectedValue + "&dcIrPurposeId=" +
                                                purpose_type.SelectedValue + "&isPublic=" +
                                                (is_public.SelectedValue == "public" ? "1" : "0"));
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var id = respDictionary["Data"].ToString();
                if (id == "")
                {
                    ShowError("Увага. Помилка при збереженні данних.");
                    return;
                }

                json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddIrExtra?sessionId=" + SessionId +
                                                "&irId=" + id + "&publFormId=" +
                                                public_form.SelectedValue + "&publishOrgId=" + org_name.SelectedValue +
                                                "&stampId=" + griff.SelectedValue + "&stampOrgId=" + griff_org_name.SelectedValue +
                                                "&title=" + long_deskription.Text + "&publicYear=" + public_year.Text +
                                                "&pages=" + page_number.Text + "&edition=" + edition.Text +
                                                "&libLocation=" +
                                                lib_location.Text);

                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var extraId = respDictionary["Data"].ToString();
                if (extraId == "")
                {
                    ShowError("Увага. Помилка при збереженні данних.");
                    return;
                }


                if (is_type.SelectedValue != null && is_name.Text != "")
                {
                    json =
                        CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddIsNumber?sessionId=" + SessionId +
                                                    "&irExtraId=" + extraId + "&isType=" + is_type.SelectedValue +
                                                    "&isNumber=" + is_name.Text);
                    respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                    var isId = respDictionary["Data"].ToString();
                    if (isId == "")
                    {
                        ShowError("Увага. Помилка при збереженні данних.");
                        return;
                    }
                }

                AddContributors(id);
                AddExtraLengs(id);

                ChangeNameFull(id);
            }
            ShowError("Данні успішно збережені.");
        }

        private void AddContributors(string id)
        {
            if (_irId == null)
            {
                var json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" +
                                                SessionId);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var userid = ((Dictionary<string, object>) respDictionary["Data"])["UserAccountId"].ToString();

                json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddContributor?sessionId=" +
                                            SessionId + "&irId=" + id +
                                            "&contTypeId=7&contPercent=100&notKPI=false&userAcountId=" + userid);
                respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var answer = respDictionary["Data"].ToString();
                if (answer == "false")
                {
                    ShowError("Увага. Помилка при збереженні данних.");
                    return;
                }
            }

            foreach (var cont in contributorlist) // DO NOT MAKE TO LINQ!!!!!
            {
                if (cont.DataBaseId == null)
                {
                    var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddContributor?sessionId=" +
                                                SessionId + "&irId=" + id + "&contTypeId=" +
                                                cont.ContributionType + "&contPercent=" +
                                                cont.ContributionPart + "&notKPI=" +
                                                cont.NotKpi +
                                                "&eEmployeeId=" + cont.eEmployeeId + "&name=" + cont.FullName + "&status=" +
                                                cont.Status);
                    var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                    var answer = respDictionary["Data"].ToString();
                    if (answer == "false")
                    {
                        ShowError("Увага. Помилка при збереженні данних.");
                        return;
                    }
                }
            }
        }

        private void AddExtraLengs(string id)
        {
            foreach (var lang in extralangaugelist) // DO NOT MAKE TO LINQ!!!!!
            {
                var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddExtraLang?sessionId="+SessionId + "&irId=" + id +
                                            "&title=" + lang.Name +
                                            "&annotation=" + lang.Annot + "&authors=" +
                                            lang.Authors + "&langId=" + lang.LangId +
                                            "&keyWords=" + lang.KeyWords);
                var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                var answer = respDictionary["Data"].ToString();
                if (answer == "false")
                {
                    ShowError("Увага. Помилка при збереженні данних.");
                    return;
                }
            }
        }

        private void ChangeNameFull(string id)
        {
            var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/ChangeNameFull?sessionId=" + SessionId + "&irId=" + id);
            var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            var answer = respDictionary["Data"].ToString();
            if (answer == "false")
            {
                ShowError("Увага. Помилка при збереженні данних.");
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