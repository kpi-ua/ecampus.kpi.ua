using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json;

namespace Campus.Core.Documentation
{
	
	public class Member
	{
		// ATTRIBUTES
		[XmlAttribute("name")]
        [JsonIgnore]
		public string Name { get; set; }
		
		// ELEMENTS
		[XmlElement("summary")]
		public Summary Summary { get; set; }
		
		[XmlElement("param")]
		public List<Param> Params { get; set; }
		
		[XmlElement("returns")]
		public Returns Returns { get; set; }
		
		[XmlElement("example")]
		public Example Example { get; set; }
		
		[XmlElement("remarks")]
		public Remarks Remarks { get; set; }
		
		// CONSTRUCTOR
		public Member()
		{}        

        public Member(Member member)
        {
            if (member != null)
            {
                this.Example = member.Example;
                this.Name = member.Name;
                this.Params = member.Params;
                this.Remarks = member.Remarks;
                this.Summary = member.Summary;
                this.Returns = member.Returns;
            }
        }

        public override string ToString()
        {
            return Name;
        }
	}
}
