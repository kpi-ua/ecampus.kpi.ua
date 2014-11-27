using Newtonsoft.Json;
using System;
using System.Reflection;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class Param : XmlContainer
	{
		// ATTRIBUTES
		[XmlAttribute("name")]
		public string Name { get; set; }
		
        [XmlIgnore]
        [JsonIgnore]
        public ParameterInfo ParameterInfo { get; set; }

        [XmlIgnore]
        public Type ParameterType { get; set; }
		
        public override string ToString()
        {
            return Name;
        }
	}
}
