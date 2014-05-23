using System.Web.UI;

namespace Core
{
    public class SiteMasterPage : MasterPage
    {
        protected SitePage SitePage
        {
            get { return this.Page as SitePage; }
        }
    }
}
