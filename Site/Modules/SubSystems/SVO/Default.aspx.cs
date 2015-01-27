using System;
using System.Collections.Generic;
using System.Collections;
using System.Web.UI.WebControls;

namespace Site.Modules.SubSystems.SVO
{
    public partial class Default : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
        }

        protected void TreeView_SelectedNodeChanged(object sender, EventArgs e)
        {

        }

        protected void TreeView_Load(object sender, EventArgs e)
        {

        }

        private void AddSubDivision(ArrayList dataArr)
        {
            throw new NotImplementedException();
        }

        protected void CafList_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        protected void CafList_Load(object sender, EventArgs e)
        {
            var subSysId = Session["svoId"];

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