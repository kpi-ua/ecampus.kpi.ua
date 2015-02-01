using System.Linq;
using System.Web.UI;
using Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Campus.Common;

namespace Site.Modules.SubSystems.GSVO
{
    public partial class Default : Core.SitePage
    {

        List<Campus.Common.OKR> okrList = new List<Campus.Common.OKR>();

        List<RtProfTrainTotal> rtList = new List<RtProfTrainTotal>();
        protected override void OnLoad(EventArgs e)
        {
            if (SessionId == null)
            {
                Response.Redirect("/login");
            }
        }

        protected void TreeView_SelectedNodeChanged(object sender, EventArgs e)
        {
            try
            {
                Session["treevalue"] = TreeView.SelectedValue.ToString();
                Session["okr"] = TreeView.SelectedNode.Parent.Value.ToString();
                Session["GSVOSpec"] = TreeView.SelectedNode.Text;
                Session["RtProfTrainTotalId"] = TreeView.SelectedValue.ToString();
                Session["SubdivisionName"] = CafList.SelectedItem.ToString();

                Response.Redirect("DisciplineTable.aspx");
            }
            catch (Exception)
            {
                return;
            }





        }

        protected void TreeView_Load(object sender, EventArgs e)
        {
            TreeView.Nodes.Clear();

            foreach (var item in CampusClient.GetOKR())
            {
                okrList.Add(
                    new Campus.Common.OKR
                    {
                        DcOKRId = item.DcOKRId,
                        Name = item.Name
                    });

                TreeNode node = new TreeNode(item.Name, item.DcOKRId.ToString());

                TreeView.Nodes.Add(node);
                if ((Session["subdivisionId"]) != null)
                {
                    try
                    {
                        foreach (var itemSpec in CampusClient.GetSpecialities(Convert.ToInt32(Session["subdivisionId"]), item.DcOKRId))
                        {
                            rtList.Add(new RtProfTrainTotal
                            {
                                Id = itemSpec.Id,
                                Name = itemSpec.Name,
                                TotalShifr = itemSpec.TotalShifr
                            });

                            TreeNode childnode = new TreeNode(itemSpec.TotalShifr + "\t" + itemSpec.Name, itemSpec.Id.ToString());

                            node.ChildNodes.Add(childnode);

                            if (node.ChildNodes == null)
                            {
                                node.Parent.Text = null;
                            }
                        }
                    }
                    catch
                    {
                        return;
                    }
                }
            }
        }

        protected void CafList_SelectedIndexChanged(object sender, EventArgs e)
        {
            Session["subdivisionId"] = CafList.SelectedValue;

            TreeView_Load(sender, e);
        }

        protected void CafList_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                CafList.Items.Add("Не вибрано");

                int subSysId = (int)Session["gsvoId"];

                List<Campus.Common.Division> subdivList = new List<Campus.Common.Division>();

                foreach (var item in CampusClient.GetSubdivisions(SessionId, subSysId))
                {
                    subdivList.Add(new Campus.Common.Division
                    {
                        SubdivisionId = item.SubdivisionId,
                        Name = item.Name
                    });

                    CafList.Items.Add(new ListItem(item.Name, item.SubdivisionId.ToString()));
                }
            }
        }
    }
}