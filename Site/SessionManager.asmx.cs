using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace Site
{
    /// <summary>
    /// Summary description for SessionManager
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class SessionManager : System.Web.Services.WebService
    {

        [WebMethod(EnableSession=true)]
        public void SetSessionValue(string key, string value)
        {
            if (Session != null)
            {
                Session[key] = value;
            }
        }
    }
}
