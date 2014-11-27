using System.Linq;
using System.Web.UI;
using AjaxControlToolkit.HTMLEditor.ToolbarButton;
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
            
        }

        protected void TreeView_SelectedNodeChanged(object sender, EventArgs e)
        {

        }

        protected void TreeView_Load(object sender, EventArgs e)
        {

        }       

        private void AddSubDivision(ArrayList dataArr)
        {
            CafList.Items.Add(new ListItem("Не обрано", "-1"));

            for(int i = 0; i < dataArr.Count; i++)
            {
                var li = new ListItem();

                var subdivId = new ListItem();

                foreach(var e in (Dictionary<string, object>)dataArr[i])
                {
                    if (e.Key.ToString() == "Name" && e.Key.ToString() == "SubdivisionId")
                    {
                        li.Text = e.Value.ToString();

                        subdivId.Text = e.Value.ToString();
                    }

                    //else
                    //{
                    //    li.Value = e.Value.ToString();
                    //}
                }

                CafList.Items.Add(li);
                break;
            }
        }

        protected void CafList_SelectedIndexChanged(object sender, EventArgs e)
        {
            
        }

        protected void CafList_Load(object sender, EventArgs e)
        {
            var subSysId = Session["gsvoId"];

            CafList.Items.Add(SessionId.ToString());

            var answer = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Responsible/GetSubDivisions?sessionId=" + SessionId + "&subsystemId=" + subSysId);

            CafList.Items.Clear();

            if (answer != null)
            {
                var dataArr = (ArrayList)answer["Data"];
                AddSubDivision(dataArr);
            }
        }

    }
}