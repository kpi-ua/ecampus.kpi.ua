using System;

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

        private static ReferenceAttribute _instance;

        public static ReferenceAttribute Instance
        {
            get { return _instance ?? (_instance = new ReferenceAttribute(null)); }
        }
    }
}
