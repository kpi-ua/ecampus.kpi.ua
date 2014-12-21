using Core;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Site.Modules.SubSystems
{
    public partial class Default : Core.SitePage
    {
        /// <summary>
        /// Значення підсистеми ОПП ГСВО для переходу на сторінку підсистеми
        /// </summary>
        private const int _gsvoSubsystemId = 14;

        /// <summary>
        /// Значення підсистеми ОПП СВО для переходу на сторінку підсистеми
        /// </summary>
        private const int _svoSubsystemId = 1;

        protected void Page_Load(object sender, EventArgs e)
        {
            var ansver = CampusClient.GetData(Campus.SDK.Client.ApiEndpoint + "Responsible/GetSubsystems?sessionId=" + SessionId);

            if (ansver != null)
            {
                var subsys = (ArrayList)ansver["Data"];

                TakeSubsystems(subsys);
            }
        }

        private void TakeSubsystems(ArrayList subsys)
        {
            for (int i = 0; i < subsys.Count; i++)
            {
                var sys = (Dictionary<string, object>)subsys[i];

                MySubsystemsContainer.Controls.Add(SubsystemsBlock(sys));
            }
        }

        private HtmlGenericControl SubsystemsBlock(Dictionary<string, object> sys)
        {
            var subsysDiv = new HtmlGenericControl("div");
            subsysDiv.Attributes.Add("class", "inf_des");

            Button subsystembtn = new Button();


            if ((string)sys["NameShort"] != null)
            {
                subsystembtn.Text = sys["NameShort"].ToString();
            }
            else
            {
                subsystembtn.Text = sys["Name"].ToString();
            }

            subsystembtn.ToolTip = "ID: " + sys["SubsystemId"].ToString();     //Підказка при наведенні
            subsystembtn.CssClass = "btn btn-success btn-sm";
            subsystembtn.Width = 200;
            subsystembtn.Height = 100;

            switch ((int)sys["SubsystemId"])
            {
                case _gsvoSubsystemId:
                    subsystembtn.Click += new EventHandler(GetToGSVOSubSystem);
                    Session["gsvoId"] = _gsvoSubsystemId;
                    break;

                case _svoSubsystemId:
                    subsystembtn.Click += new EventHandler(GetToSVOSubsystem);
                    Session["svoId"] = _svoSubsystemId;
                    break;
            }
                

            subsysDiv.Controls.Add(subsystembtn);

            return subsysDiv;

        }

        private void GetToSVOSubsystem(object sender, EventArgs e)
        {
            Response.Write("SVO/Default.aspx");
        }

        private void GetToGSVOSubSystem(object sender, EventArgs e)
        {
            Response.Redirect("GSVO/Default.aspx");
        }
    }
}