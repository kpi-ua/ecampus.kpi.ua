using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class ReferenceAttribute : AbstractAttribute
    {
        public string Url { get; private set; }

        public ReferenceAttribute(string url)
        {
            Url = url;
        }

        private static ReferenceAttribute _instance = null;
        public static ReferenceAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new ReferenceAttribute(null);
                return _instance;
            }
        }
    }
}
