using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.MZSearch
{

    public partial class Default : Core.SitePage
    {
       
        protected void Page_Load(object sender, EventArgs e)
        {

            if (irEdit.Attributes["value"] != null && irEdit.Attributes["Value"].ToString() != "")
            {
                Session["IrEdit"] = irEdit.Attributes["value"].ToString();
                Response.Redirect("~/EIR/CardEdit.aspx");
            }

            if (!Page.IsPostBack)
            {

                isdisc.Attributes["Value"] = true.ToString();
                session.Attributes["Value"] = SessionId;

                var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetDiscList");

                if (answer != null)
                {
                    var dataArr = (ArrayList)answer["Data"];

                    SList.Items.Clear();
                    SList.Items.Add(new ListItem("Дисципліну не обрано!", "-1"));

                    LoadDiscList(dataArr);
                }
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

                SList.Items.Add(li);
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

                SFList.Items.Add(li);
            }
        }

        

      
        protected void inpDisc_OnCheckedChanged(object sender, EventArgs e)
        {
            sb.Visible = false;
            inpCred.Checked = false;
            

            isdisc.Attributes["Value"] = true.ToString();
            SList.Items.Clear();
            SList.Items.Add(new ListItem("Дисципліну не обрано!", "-1"));

            NameDisc.InnerText = "Оберіть дисципліну";

            SFdiv.Visible = false;

            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetDiscList");

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                LoadDiscList(dataArr);
            }
        }

        protected void inpCred_OnCheckedChanged(object sender, EventArgs e)
        {
            sb.Visible = false;
            inpDisc.Checked = false;
            

            isdisc.Attributes["Value"] = false.ToString();
            SFdiv.Visible = true;
            NameDisc.InnerText = "Оберіть кредитний модуль";

            SFList.Items.Clear();
            SFList.Items.Add(new ListItem("Не обрано", "-1"));

            SList.Items.Clear();
            SList.Items.Add(new ListItem("Не обрано", "-1"));

            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetCredList");

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                LoadDiscList(dataArr);
            }

        }

        protected void DiscList_OnSelectedIndexChanged(object sender, EventArgs e)
        {

            sb.Visible = false;
            

            Dictionary<string, object> answer = null;

            if (inpDisc.Checked)
            {
                answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetSpecialityD?sessionId"+CampusClient.SessionId+"&discId=" + DiscList.SelectedValue.ToString());
            }
            else
            {
                answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetSpecialityC?sessionId" + CampusClient.SessionId + "&credId=" + DiscList.SelectedValue.ToString());
            }

            SList.Items.Clear();
            SList.Items.Add(new ListItem("Не обрано", "-1"));

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                LoadSpecList(dataArr);
            }

        }

        protected void SList_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            

            if (SList.SelectedValue.ToString() == "-1")
            {
                sb.Visible = false;
               
            }
            else
            {
                var getSF = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetStudyFormList");

                if (getSF != null)
                {
                    var dataArr = (ArrayList)getSF["Data"];
                    LoadSFList(dataArr);
                }

                spec.Attributes["Value"] = SList.SelectedValue.ToString();
                disc.Attributes["Value"] = DiscList.SelectedValue.ToString();

                if (inpDisc.Checked)
                {
                    sb.Visible = true;
                }
            }
        }

        protected void SFList_OnSelectedIndexChanged(object sender, EventArgs e)
        {
            

            if (SFList.SelectedValue.ToString() == "-1")
            {
                sb.Visible = false;
            }
            else
            {
                stdfrm.Attributes["Value"] = SFList.SelectedValue.ToString();
                sb.Visible = true;
            }
        }

        
    }
}