using System;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    [Serializable]
    [XmlType(TypeName = "member")]
    public class Member : Element
    {
        [XmlElement("summary")]
        public string Summary { get; set; }

        [XmlElement("param")]
        public Param[] Param { get; set; }

        [XmlElement("returns")]
        public string Returns { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
