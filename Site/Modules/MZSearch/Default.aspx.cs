using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.WebControls;

namespace Site.MZSearch
{
    public partial class Default : Core.SitePage
    {
       
        protected void Page_Load(object sender, EventArgs e)
        {

            if (irEdit.Attributes["value"] != null && irEdit.Attributes["Value"].ToString() != "")
            {
                Session["EirEdit"] = true;
                Session["EirId"] = irEdit.Attributes["value"].ToString();
                Response.Redirect("~/Modules/EIR/CardEdit.aspx");
            }

            if (!Page.IsPostBack)
            {

                isdisc.Attributes["Value"] = true.ToString();
                session.Attributes["Value"] = SessionId;
            }
        }

        public void LoadDiscList(ArrayList data)
        {
            DiscList.Items.Clear();
            DiscList.Items.Add(new ListItem("Не обрано", "-1"));

            for (int i = 0; i < data.Count; i++)
            {
                var li = new ListItem();

                foreach (var e in (Dictionary<string, object>)data[i])
                {
                    if (e.Key.ToString() == "Name") li.Text = e.Value.ToString();
                    else li.Value = e.Value.ToString();

                }

                DiscList.Items.Add(li);
            }
        }

        public void LoadSpecList(ArrayList data)
        {

            for (int i = 0; i < data.Count; i++)
            {
                var li = new ListItem();

                foreach (var e in (Dictionary<string, object>)data[i])
                {
                    if (e.Value == null) continue;

                    if (e.Key.ToString() == "TotalShifr")
                    {
                        li.Text += " " + e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "Name")
                    {
                        li.Text = e.Value.ToString();
                    }
                    else if (e.Key.ToString() == "RtProfTrainTotalId") { li.Value = e.Value.ToString(); }

                }

                SpecList.Items.Add(li);
            }
        }

        public void LoadSFList(ArrayList data)
        {

            for (int i = 0; i < data.Count; i++)
            {
                var li = new ListItem();

                foreach (var e in (Dictionary<string, object>)data[i])
                {
                    if (e.Key.ToString() == "Name")
                    {
                        li.Text = e.Value.ToString();

                    }
                    else li.Value = e.Value.ToString();

                }
            }
        }       

        protected void SList_OnSelectedIndexChanged(object sender, EventArgs e)
        {            
            var getSF = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetStudyFormList");

            if (getSF != null)
            {
                var dataArr = (ArrayList)getSF["Data"];
                //LoadSFList(dataArr);
            }

            spec.Attributes["Value"] = SpecList.SelectedValue.ToString();
        }        
    }
}