using Campus.SDK;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.EIR
{
    public partial class Search : Core.SitePage
    {
        private bool _isGroup;
        private Client _client;
        private string _addGroupUrl;

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            /*
            if (Request.QueryString["type"] != null)
            {
                _isGroup = (Request.QueryString["type"].Equals("group"));
                var irGroupId = Session["irGroupId"].ToString();
                _addGroupUrl = Campus.SDK.Client.BuildUrl("IrGroup", "AddIrToGroup", new { SessionId, irGroupId }) + "&irId=";
            }

            _client = new Campus.SDK.Client();
            var url = Campus.SDK.Client.BuildUrl("Ir", "GetIr", new { SessionId });

            var result = _client.Get(url);

            var inner = JsonConvert.DeserializeObject(result.Data.ToString());
            if (inner != null)
            {
                var items = (inner as IEnumerable<Object>).Cast<JObject>().ToList();
                foreach (var ir in items)
                {
                    LinkButtonsRendering(ir);
                }
            }*/
            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "TimeTable/GetEmployees");

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                ShowData(dataArr);
            }
        }

        private void ShowData(ArrayList data)
        {

            for (int i = 0; i < data.Count; i++)
            {
                var irLink = new LinkButton();
                var mainDiv = new HtmlGenericControl("div");
                var surname = new HtmlGenericControl("h5");
                var name = new HtmlGenericControl("h5");
                var patronymic = new HtmlGenericControl("h5");
                var Dutie = new HtmlGenericControl("h5");
                var Subdiv = new HtmlGenericControl("h5");
                var AcademicDegree = new HtmlGenericControl("h5");
                var AcademicStatus = new HtmlGenericControl("p");
                mainDiv.Attributes.Add("id", "employee");
                foreach (var e in (Dictionary<string, object>)data[i])
                {

                    if (e.Key.ToString() == "eEmployees1Id")
                    {
                        irLink.PostBackUrl = Request.Url.AbsolutePath;
                        irLink.Attributes.Add("class", "irLink list-item list-item-info");
                        irLink.Attributes.Add("Id", e.Value.ToString());
                    }
                    else if (e.Key.ToString() == "Surname")
                    {
                        surname.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "Name")
                    {
                        name.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "Patronymic")
                    {
                        patronymic.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "DutieName")
                    {
                        Dutie.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "SubdivisionName")
                    {
                        Subdiv.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "AcademicDegreeName")
                    {
                        AcademicDegree.InnerText = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "AcademicStatusName")
                    {
                        AcademicStatus.InnerText = e.Value.ToString();
                    }
                }
                mainDiv.Controls.Add(surname);
                mainDiv.Controls.Add(name);
                mainDiv.Controls.Add(patronymic);
                mainDiv.Controls.Add(Dutie);
                mainDiv.Controls.Add(Subdiv);
                mainDiv.Controls.Add(AcademicDegree);
                mainDiv.Controls.Add(AcademicStatus);

                irLink.Controls.Add(mainDiv);

                LinkContainer.Controls.Add(irLink);
            }
        }

        private void LinkButtonsRendering(JObject group)
        {
            var irLink = new LinkButton();
            var mainDiv = new HtmlGenericControl("div");
            var nameShort = new HtmlGenericControl("h5");
            var nameFull = new HtmlGenericControl("h6");
            var description = new HtmlGenericControl("p");


            irLink.PostBackUrl = Request.Url.AbsolutePath;
            irLink.Attributes.Add("class", "irLink list-item list-item-info");
            irLink.Attributes.Add("IrId", group["IrId"].ToString());

            mainDiv.Attributes.Add("id", "irGroupMainBlock");
            //mainDiv.Attributes.Add("class", ".form-inline");

            nameShort.Attributes.Add("id", "irGroupName");
            //nameShort.Attributes.Add("class", "text-primary");

            //description.Attributes.Add("class", "irGroupDescription");

            nameShort.InnerText = group["NameShort"].ToString();
            nameFull.InnerText = group["NameFull"].ToString();
            description.InnerText = group["IrId"].ToString();



            mainDiv.Controls.Add(nameShort);
            mainDiv.Controls.Add(nameFull);
            mainDiv.Controls.Add(description);

            irLink.Controls.Add(mainDiv);

            LinkContainer.Controls.Add(irLink);

            if (_isGroup)
            {
                var addToGroupButton = new Button();
                addToGroupButton.UseSubmitBehavior = false;
                addToGroupButton.Text = "Додати до групи";
                var url = _addGroupUrl + group["IrId"].ToString();
                addToGroupButton.OnClientClick = "httpGet(\"" + url + "\"); return false;";
                LinkContainer.Controls.Add(addToGroupButton);
            }
        }

    }
}