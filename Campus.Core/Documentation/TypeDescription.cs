using System;
using System.Runtime.CompilerServices;

namespace Campus.Core.Documentation
{
    public class TypeDescription
    {
        public TypeDescription()
        {
        }

        public TypeDescription(System.Reflection.ParameterInfo parameterInfo)
        {
            Name = parameterInfo.Name;
            Type = parameterInfo.ParameterType.ToString();
        }

        public TypeDescription(System.Reflection.ParameterInfo parameterInfo, string description)
            : this(parameterInfo)
        {
            Description = description;
        }

        public String Name { get; set; }
        public String Type { get; set; }
        public String Description { get; set; }
    }
}
