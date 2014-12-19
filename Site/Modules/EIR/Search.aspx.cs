using Campus.SDK;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.Script.Serialization;
using System.Text;

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
            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Employee/GetEmployee");

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                ShowData(dataArr);
            }
        }

        private void ShowData(ArrayList data)
        {

            foreach (Dictionary<string, object> item in data)
            {
                var irLink = new LinkButton();
                var mainDiv = new HtmlGenericControl("div");
                var Fullname = new HtmlGenericControl("h5");
                var SubName = new HtmlGenericControl("h6");
                var Dutie = new HtmlGenericControl("h6");
                var AcademicDegree = new HtmlGenericControl("h6");
                var AcademicStatus = new HtmlGenericControl("p");
                var images = new StringBuilder();

                mainDiv.Attributes.Add("id", "employee");
                irLink.PostBackUrl = Request.Url.AbsolutePath;
                irLink.Attributes.Add("class", "irLink list-item list-item-info");
                irLink.Attributes.Add("Id", item["eEmployees1Id"].ToString());
                string Fname = "ПІБ: ";
                if (item["Surname"] != null)
                {
                    Fname += item["Surname"].ToString() + " ";
                }
                if (item["Name"] != null)
                {
                    Fname += item["Name"].ToString() + " ";
                }
                if (item["Patronymic"] != null)
                {
                    Fname += item["Patronymic"].ToString();
                }
                Fullname.InnerText = Fname;
                if (item["SubdivName"] != null)
                {
                    SubName.InnerText += item["SubdivName"].ToString() + " ";
                }
                if (item["DutiesName"] != null)
                {
                    Dutie.InnerText = item["DutiesName"].ToString();
                }

                if (item["AcademicDegreeName"] != null)
                {
                    AcademicDegree.InnerText = item["AcademicDegreeName"].ToString();
                }

                if (item["UserAccountId"] != null)
                {
                    var answer = CampusClient.DownloadString(Campus.SDK.Client.ApiEndpoint + "Employee/GetEmployeePhoto?EmployeeAcountId=" + item["UserAccountId"].ToString());
                    //var dataArr = (ArrayList)
                    JavaScriptSerializer _serializer = new JavaScriptSerializer();
                    var respDictionary = _serializer.Deserialize<Dictionary<string, object>>(answer);
                    var url = respDictionary["Data"];
                    images.AppendFormat(@"<img id =""employee_photo""{1}"""" src=""{0}"" style=""width:150px;height:200px""/>", url.ToString(), item["UserAccountId"].ToString());
                }
                mainDiv.InnerHtml = images.ToString();
                mainDiv.Controls.Add(Fullname);
                mainDiv.Controls.Add(SubName);
                mainDiv.Controls.Add(Dutie);
                mainDiv.Controls.Add(AcademicDegree);
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