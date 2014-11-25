using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;

namespace Campus.Core.Documentation
{
	
	public class Members
	{
		
		// ELEMENTS
		[XmlElement("member")]
		public List<Member> Member { get; set; }
		
		// CONSTRUCTOR
		public Members()
		{}
	}
}
