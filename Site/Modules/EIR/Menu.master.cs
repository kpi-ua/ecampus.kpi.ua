using System;
using Core;

namespace Site.Modules.EIR
{
    public partial class Menu : System.Web.UI.MasterPage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            api.Value = Core.CampusClient.ApiEndpoint;
            ssid.Value = (this.Page as SitePage).SessionId;
        }
    }
}