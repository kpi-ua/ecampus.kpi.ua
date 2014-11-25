using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using Newtonsoft.Json;

namespace Campus.Core.Documentation
{
	
	public class Param
	{
		// ATTRIBUTES
		[XmlAttribute("name")]
		public string Name { get; set; }
		
		// ELEMENTS
		[XmlText]
		public string Value { get; set; }

        [XmlIgnore]
        [JsonIgnore]
        public ParameterInfo ParameterInfo { get; set; }

        [XmlIgnore]
        public Type ParameterType { get; set; }
		
		// CONSTRUCTOR
		public Param()
		{}

        public override string ToString()
        {
            return Name;
        }
	}
}
