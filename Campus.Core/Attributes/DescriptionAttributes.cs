using System;

namespace Campus.Core.Attributes
{
    [AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = true)]
    public sealed class DescriptionAttribute : AbstractAttribute
    {
        private readonly string _description;

        public DescriptionAttribute(string description)
        {
            _description = description;
        }

        public string Description
        {
            get { return _description; }
        }

        private static DescriptionAttribute _instance = null;
        public static DescriptionAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new DescriptionAttribute(null);
                return _instance;
            }
        }
    }
}
