using System;

namespace Site.Modules.EIR
{
    public partial class Create : Core.SitePage
    {
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            ssid.Value = CampusClient.SessionId;
            api.Value = Core.CampusClient.ApiEndpoint;
        }
    }
}