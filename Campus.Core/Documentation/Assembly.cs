using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;

namespace Campus.Core.Documentation
{
	
	public class Assembly
	{
		
		// ELEMENTS
		[XmlElement("name")]
		public Name Name { get; set; }

        [XmlIgnore]
        [JsonIgnore]
        public List<Controller> Types { get; set; }
		
		// CONSTRUCTOR
		public Assembly()
		{}

        public override string ToString()
        {
            return Name.Value;
        }
	}
}
