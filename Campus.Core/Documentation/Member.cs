using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    [Serializable]
    [XmlType(TypeName = "member")]
    public class Member
    {
        [XmlElement("summary")]
        public string Summary { get; set; }

        [XmlElement("param")]
        public Param[] Param { get; set; }

        [XmlElement("returns")]
        public string Returns { get; set; }

        [XmlAttribute("name")]
        public string Name { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
