using System.Linq;
using System.Web.UI;
using Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.SubSystems.GSVO
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            if(SessionId == null)
            {
                Response.Redirect("/login");
            }
        }

        protected void TreeView_SelectedNodeChanged(object sender, EventArgs e)
        {

        }

        protected void TreeView_Load(object sender, EventArgs e)
        {

        }

        //private void AddSubDivision(List<Campus.Common.Subdivision> dataArr)
        private void AddSubDivision(ArrayList dataArr)
        {
            CafList.Items.Add(new ListItem("Не обрано", "-1"));

            for (int i = 0; i < dataArr.Count; i++)
            {
                var li = new ListItem();

                var subdivId = new ListItem();

                foreach (var e in (Dictionary<string, object>)dataArr[i])
                {
                    if (e.Key.ToString() == "Name")
                    {
                        li.Text = e.Value.ToString();
                    }

                    else
                    {
                        li.Value = e.Value.ToString();
                    }
                }

                CafList.Items.Add(li);

                //foreach (var subd in dataArr)
                //{
                //    CafList.Items.Add(subd.Name);
                //}
            }
        }

        protected void CafList_SelectedIndexChanged(object sender, EventArgs e)
        {
            Session["subdivisionId"] = CafList.SelectedValue;
        }

        protected void CafList_Load(object sender, EventArgs e)
        {
            var subSysId = Session["gsvoId"];

            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Responsible/GetSubDivisions?sessionId=" + SessionId + "&subsystemId=" + subSysId);

            //CafList.Items.Clear();

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                AddSubDivision(dataArr);
            }
            //}
            //var subdivision = CampusClient.GetSubdivisions(SessionId, Int32.Parse(Session["gsvoId"].ToString()));
            //AddSubDivision(subdivision);
        }

    }
}