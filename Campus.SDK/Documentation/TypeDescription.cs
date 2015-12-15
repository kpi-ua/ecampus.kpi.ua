using System;

namespace Campus.SDK.Documentation
{
    public class TypeDescription : Element
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

        public String Type { get; set; }
        public String Description { get; set; }
    }
}
