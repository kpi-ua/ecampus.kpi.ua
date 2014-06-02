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

    public partial class MZSearch : Core.SitePage
    {
       
        protected void Page_Load(object sender, EventArgs e)
        {

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

        //protected void LeftDivRendering()
        //{
        //    var container = new HtmlGenericControl("div");
        //    container.Attributes.Add("class", "col-md-12 ldc");

        //    MZContainerRendering(container);

        //    leftDiv.Controls.Add(container);
        //}

        //protected void MZContainerRendering(HtmlGenericControl parent)
        //{
        //    Dictionary<string, object> answer = null;

        //    if (inpDisc.Checked)
        //    {
        //        answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetDisc?rtpttId="+spec.Attributes["Value"].ToString());
        //    }
        //    else
        //    {
        //        answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetCred?rtpttId=" + spec.Attributes["Value"].ToString());
        //    }

        //    if (answer != null && inpDisc.Checked)
        //    {
        //        var dataArr = (ArrayList)answer["Data"];
        //        RenderDisc(dataArr, parent);
        //    } else if (answer != null && inpCred.Checked) {
        //        var dataArr = (ArrayList)answer["Data"];
        //        //RenderCred(dataArr, parent);
        //    }

        //}

        //protected void RenderDisc(ArrayList data, HtmlGenericControl parent)
        //{
        //    for (int i = 0; i < data.Count; i++)
        //    {
        //        var lb = new LinkButton();
        //        lb.PostBackUrl = Request.Url.AbsolutePath;
                
        //        lb.Attributes.Add("class", "clink");
        //        var title = new HtmlGenericControl("p");
        //        title.Attributes.Add("class", "itemrow");

        //        foreach (var e in (Dictionary<string, object>) data[i])
        //        {
        //            if (e.Key.ToString() == "Name") //Change to NameFull
        //            {
        //                title.InnerText = e.Value.ToString();
        //            }
        //            else lb.Attributes.Add("did",e.Value.ToString());

        //        }
                
        //        lb.Controls.Add(title);
        //        parent.Controls.Add(lb);
        //    }
        //}

      
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
                answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetSpecialityD?discId=" + DiscList.SelectedValue.ToString());
            }
            else
            {
                answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "MZSearch/GetSpecialityC?credId=" + DiscList.SelectedValue.ToString());
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

        //protected void sb_OnClick(object sender, EventArgs e)
        //{
        //    sTitle.Visible = true;
        //    sresult.Visible = true;

        //    //LeftDivRendering();
        //}
    }
}