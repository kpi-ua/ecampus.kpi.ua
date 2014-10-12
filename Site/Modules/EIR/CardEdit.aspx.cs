using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using Campus.SDK;

namespace Site.Modules.EIR
{
    /// <summary>
    /// for edit is needed Session["EirEdit"] & Session["EirId"]
    /// </summary>
    public partial class CardEdit : Core.SitePage
    {

        public static string _irId;
        readonly JavaScriptSerializer serializer = new JavaScriptSerializer();

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var json = CampusClient.DownloadString(Client.ApiEndpoint + "User/GetCurrentUser?sessionId=" + SessionId);
            var answer = (Dictionary<string, object>)serializer.Deserialize<Dictionary<string, object>>(json)["Data"];
            var Employees = (ArrayList)answer["Employees"];
            if (Employees.Count == 0)
            {
                throw new Exception("You have no rights to be there =(");
            }

            if (Page.IsPostBack) return;

            LoadAllList();

            //Session["EirEdit"] = true;
            //Session["EirId"] = 48978;

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
            errorField.Value = errText;
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

            grif_country.SelectedValue = "226";
            org_country.SelectedValue = "226";

            data = CampusClient.GetLang();

            foreach (var item in data)
            {
                language.Items.Add(new ListItem(Convert.ToString(item.Value), item.Key.ToString()));
            }
            language.SelectedValue = "2";

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

            //json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetContributors?sessionId=" + SessionId + "&irId=" +
            //                               _irId);
            //respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            //var newdata = (ArrayList)respDictionary["Data"];

            //foreach (var item in newdata)
            //{

            //    var nItem = (Dictionary<string, object>) item;

            //    //
            //}

            //json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/GetExtraLangs?irId=" +
            //                               _irId);
            //respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
            //newdata = (ArrayList)respDictionary["Data"];

            //foreach (var item in newdata)
            //{
            //    var nItem = (Dictionary<string, object>) item;

            //    //
            //}

        }


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
                                                "&dateCreate=" + (date.Text != "" ? (DateTime.ParseExact(date.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&datePublish=" + DateTime.Today +
                                                "&accessStart=" + (access_begin.Text != "" ? (DateTime.ParseExact(access_begin.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&accessEnd=" + (access_end.Text != "" ? (DateTime.ParseExact(access_end.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + (doc_date.Text != "" ? (DateTime.ParseExact(doc_date.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&dcIrFormId=" + form_type.SelectedValue +
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
                AddExtraLangs(_irId);

                ChangeNameFull(_irId);
                Session["EirId"] = _irId;
                Response.Redirect("CardView.aspx");
            }
            else
            {
                var json =
                    CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddIr?sessionId=" + SessionId +
                                                "&name=" +
                                                name.Text + "&description=" + short_description.Text +
                                                "&dateCreate=" + (date.Text != "" ? (DateTime.ParseExact(date.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&datePublish=" + DateTime.Today +
                                                "&accessStart=" + (access_begin.Text != "" ? (DateTime.ParseExact(access_begin.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&accessEnd=" + (access_end.Text != "" ? (DateTime.ParseExact(access_end.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") +
                                                "&docNumber=" + doc_number.Text +
                                                "&docDate=" + (doc_date.Text != "" ? (DateTime.ParseExact(doc_date.Text, "dd.mm.yyyy", CultureInfo.InvariantCulture)).ToString() : "") + "&dcIrFormId=" + form_type.SelectedValue +
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
                AddExtraLangs(id);

                ChangeNameFull(id);
                Session["EirId"] = id;
                Response.Redirect("CardView.aspx");
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
                var userid = ((Dictionary<string, object>)respDictionary["Data"])["UserAccountId"].ToString();

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

            //parsing json
            var arrayPersons = serializer.Deserialize<ArrayList>(persons_json.Value);
            foreach (var item in arrayPersons)
            {
                var part = (Dictionary<string, object>)item;

                string newjson = "";

                if (part.ContainsKey("id"))
                {
                    if (!part.ContainsKey("name") && !part.ContainsKey("part_percent"))
                    {
                        var url = Client.ApiEndpoint + "Ir/DeleteContributor?sessionId=" + SessionId + "&contributorId=" + part["id"];
                        var json = CampusClient.DownloadString(url);
                        var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);

                        if (respDictionary["Data"].ToString() != "true")
                        {
                            ShowError("Увага. Помилка при збереженні данних.");
                            return;
                        }
                    }
                    else
                    {
                        var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/UpdateContributor?sessionId=" +
                                                               SessionId + "&id=" + part["id"] + "&notKPI=" +
                                                               (!Convert.ToBoolean(part["kpi"])) +
                                                               "&contTypeId=" + part["part_type"] + "&contPercent=" +
                                                               part["part_percent"] + "&name=" + part["name"] +
                                                               (part.ContainsKey("per_type")
                                                                   ? "&status=" + part["per_type"]
                                                                   : "") +
                                                               (part.ContainsKey("name_id") &&
                                                                part.ContainsKey("name_acs")
                                                                   ? (part["name_acs"] == "empl"
                                                                       ? "&eEmployeeId=" + part["name_id"]
                                                                       : "&userAcountId=" + part["name_id"])
                                                                   : ""));
                        var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                        if (respDictionary["Data"].ToString() != "true")
                        {
                            ShowError("Увага. Помилка при збереженні данних.");
                            return;
                        }
                    }
                }

                if (part.ContainsKey("name_id") && part.ContainsKey("name_acs"))
                {
                    if ((string)part["name_acs"] == "empl")
                    {
                        
                        newjson =
                            CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddContributor?sessionId=" + SessionId +
                                                        "&irId=" + id + "&notKPI=" +
                                                        (!Convert.ToBoolean(part["kpi"])).ToString() + "&contTypeId=" +
                                                        part["part_type"] + "&contPercent=" + part["part_percent"] +
                                                        "&name=" + part["name"] + "&status=" +
                                                        (part.ContainsKey("per_type") ? part["per_type"] : "") +
                                                        "&eEmployeeId=" + part["name_id"]);
                    }
                    else
                    {
                        newjson = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddContributor?sessionId=" + SessionId + "&irId=" + id + "&notKPI=" + (!Convert.ToBoolean(part["kpi"])).ToString() + "&contTypeId=" + part["part_type"] + "&contPercent=" + part["part_percent"] + "&name=" + part["name"] + "&status=" + (part.ContainsKey("per_type") ? part["per_type"] : "") + "&userAcountId=" + part["name_id"]);
                    }
                }
                else
                {
                    newjson = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddContributor?sessionId=" + SessionId + "&irId=" + id + "&notKPI=true&contTypeId=" + part["part_type"] + "&contPercent=" + part["part_percent"] + "&name=" + part["name"] + "&status=" + (part.ContainsKey("per_type") ? part["per_type"] : ""));
                }

                var answer = serializer.Deserialize<Dictionary<string, object>>(newjson)["Data"].ToString();
                if (answer == "false")
                {
                    ShowError("Увага. Помилка при збереженні данних.");
                    return;
                }
            }
        }

        private void AddExtraLangs(string id)
        {
            var arrayPersons = serializer.Deserialize<ArrayList>(langs_json.Value);
            foreach (var item in arrayPersons)
            {
                var part = (Dictionary<string, object>)item;
                if (part.ContainsKey("id"))
                {
                    if (!part.ContainsKey("name"))
                    {
                        var json = CampusClient.DownloadString(Client.ApiEndpoint + "Ir/DeleteExtraLang?sessionId=" +
                                                               SessionId + "&extraLangId=" + part["id"]);
                        var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                        if (respDictionary["Data"].ToString() != "true")
                        {
                            ShowError("Увага. Помилка при збереженні данних.");
                            return;
                        }
                    }
                    else
                    {
                        var json =
                            CampusClient.DownloadString(Client.ApiEndpoint + "Ir/UpdateExtraLang?sessionId=" + SessionId +
                                                        "&id=" + part["id"] + "&langId=" + part["lang"] + "&annotation=" +
                                                        part["annot"] + "&title=" + part["name"] + "&keyWords=" +
                                                        part["key_words"] + "&authors=" + part["authors"]);
                        var respDictionary = serializer.Deserialize<Dictionary<string, object>>(json);
                        if (respDictionary["Data"].ToString() != "true")
                        {
                            ShowError("Увага. Помилка при збереженні данних.");
                            return;
                        }
                    }
                }
                else
                {
                    var json =
                        CampusClient.DownloadString(Client.ApiEndpoint + "Ir/AddExtraLang?sessionId=" + SessionId +
                                                    "&irId=" +
                                                    id + "&langId=" + part["lang"] + "&annotation=" + part["annot"] +
                                                    "&title=" + part["name"] + "&keyWords=" + part["key_words"] +
                                                    "&authors=" + part["authors"]);
                    var answer = serializer.Deserialize<Dictionary<string, object>>(json)["Data"].ToString();
                    if (answer == "false")
                    {
                        ShowError("Увага. Помилка при збереженні данних.");
                        return;
                    }
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