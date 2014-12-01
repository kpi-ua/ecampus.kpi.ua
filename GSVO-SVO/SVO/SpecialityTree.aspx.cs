using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Web.Configuration;
using System.Data.SqlClient;

namespace WebApplication1
{
    public partial class SpecialityTree : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            string userId = Session["UserAccountId"].ToString();

            UserAccountId(userId);

            if (Page.IsPostBack) return;
            Session["sort"] = Session["sort"] != null ? Session["sort"].ToString() : "name";

            Session["show"] = Session["show"] != null ? Session["show"].ToString() : "All";

            Session["cathedra"] = Session["cathedra"] != null ? Session["cathedra"].ToString() : "all";
        }

        public void UserAccountId(string userAcc)
        {
            string connectionString = WebConfigurationManager.ConnectionStrings["DB"].ToString();

            SqlConnection connection = new SqlConnection(connectionString);

            SqlCommand selectResponsbleCommand = new SqlCommand("Select distinct RtResponsibleId, DcSubdivisionId From RtResponsible where UserAccountId='" + userAcc + "'and DcSubsystemId = 1", connection);
            //SqlCommand selectResponsbleCommand = new SqlCommand("select s.Name, s.DcSubdivisionId from [RtResponsible] r, [DcSubdivision] s where r.DcSubsystemId = 15 and r.UserAccountId = " + userAcc + "and r.DcSubdivisionId = s.DcSubdivisionId ORDER BY Name", connection);
            connection.Open();
            SqlDataReader reader = selectResponsbleCommand.ExecuteReader();

            List<string[]> responseList = new List<string[]>();

            if (reader.HasRows)
            {
                while (reader.Read())
                {

                    //var subID = reader.GetValue(1);

                    //Session["SubDivID"] = subID;

                }

               


                Session["RespID"] = responseList;


            }
            else
            {
                Label1.Text = "Даний користувач не є в списку відповідальних";
            }
        }

        //выбор актиных(неактивных)
        protected void DropDownList_SelectedIndexChanged(object sender, EventArgs e)
        {
            Session["show"] = DropDownList1.SelectedValue;
            
            TreeView_Load(sender, e);
        }

        //выбор способа сортировки
        protected void dropsort1_SelectedIndexChanged(object sender, EventArgs e)
        {
            Session["sort"] = dropsort2.SelectedValue;
            TreeView_Load(sender, e);
        }


        //выбор кафедры
        protected void dropsort3_SelectedIndexChanged(object sender, EventArgs e)
        {
            Session["cathedra"] = dropsort3.SelectedValue;
            TreeView_Load(sender, e);
        }

        //Підтягування імені кафедри 
        protected void dropsort3_OnLoad(object sender, EventArgs e)
        {
            var dictionaryManager = new DictionaryManager(Session);
            DataView dt = dictionaryManager.GetCathedra();

            foreach (DataRow row in dt.Table.Rows)
            {
                dropsort3.Items.Add(new ListItem(row["Name"].ToString(), row["DcSubdivisionId"].ToString()));


                
            }
            //Session["DcSubdivisionId"] = row["DcSubdivisionId"].ToString();
            Session["DcSubdivisionId"] = dropsort3.SelectedValue.ToString();
        }


        //строим дерево
        protected void TreeView_Load(object sender, EventArgs e)
        {
            TreeView.Nodes.Clear();

            var dictionaryManager = new DictionaryManager(Session);
            DataView dt = dictionaryManager.GetOkrList(null);

            foreach (DataRow row in dt.Table.Rows)
            {
                //добавляем родителя
                TreeNode node = new TreeNode(row["Name"].ToString(), row["DcOKRId"].ToString());

                if (Session["show"] == "nonAct" && row["vcActuality"].ToString() == "0")
                {
                    node.SelectAction = TreeNodeSelectAction.None;
                    node.Text += " ( actual)";
                }
                else if (Session["show"] == "Act" && row["vcActuality"].ToString() == "1")
                {
                    node.SelectAction = TreeNodeSelectAction.None;
                    node.Text += " ( non actual)";
                }
                TreeView.Nodes.Add(node);

                DataView dv = dictionaryManager.GetRtProfTrainTotalbyOKR(row["DcOKRId"].ToString(), (string)Session["show"], (string)Session["sort"], (string)Session["cathedra"]);


                if (dv != null)
                {
                    foreach (DataRow new_row in dv.Table.Rows)
                    {
                        //добавляем детей
                        TreeNode childnode = new TreeNode(new_row["TotalShifr"].ToString() + ' ' + new_row["Name"].ToString(),
                                new_row["RtProfTrainTotalId"].ToString());
                        node.ChildNodes.Add(childnode);

                        //var id = new_row["RtProfTrainTotalId"];

                        //Session["RtProfId"] = id;
                    }
                }
            }
        }

        protected void TreeView_SelectedNodeChanged(object sender, EventArgs e)
        {
            if (TreeView.SelectedNode.Depth != 0)
            {
                Session["treevalue"] = TreeView.SelectedValue.ToString();
                Session["okr"] = TreeView.SelectedNode.Parent.Value.ToString();
                Session["GSVOSpec"] = TreeView.SelectedNode.Text;
                Session["RtProfTrainTotalId"] = TreeView.SelectedValue.ToString();
                //Session["DcSubdivisionId"] = row["DcSubdivisionId"].ToString();
                //Session["RtProfTrainTotalSubdivisionId"] = TreeView.SelectedValue.ToString();
                //Session["DcSubdivisionName"] = row["Name"].ToString();
                Response.Redirect("SVO.aspx");
            }
            else
            {
                TreeView.SelectedNode.Expanded = true;
            }
        }

        protected void dropsort3_TextChanged(object sender, EventArgs e)
        {
            
        }
    }
}