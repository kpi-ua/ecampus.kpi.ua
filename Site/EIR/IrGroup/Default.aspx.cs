using Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Site.EIR.IrGroup
{
    public partial class Default : SitePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var client = new Campus.SDK.Client();
            var url = Campus.SDK.Client.BuildUrl("IrGroup", "GetAllPrivateIrGroups", new { SessionId });
            var result = client.Get(url);
            out_json.InnerText = result.Data.ToString();
        }
    }
}