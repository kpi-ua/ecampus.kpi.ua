using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;

namespace Campus.Core.Documentation
{
	
	public class Example
	{
		
		// ELEMENTS
		[XmlText]
		public string Value { get; set; }
		
		// CONSTRUCTOR
		public Example()
		{}

        public override string ToString()
        {
            return Value;
        }
	}
}
