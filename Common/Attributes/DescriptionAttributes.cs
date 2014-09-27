using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Attributes
{
    [AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = true)]
    public sealed class DescriptionAttribute : AbstractAttribute
    {
        string _description;
   
        public DescriptionAttribute(string description)
        {
            _description = description;
        }

        public string Description
        {
            get { return _description; }
        }
    }
}
