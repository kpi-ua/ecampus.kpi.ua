using System.Collections.Generic;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{

    public class Members
    {
        // ELEMENTS
        [XmlElement("member")]
        public List<Member> Member { get; set; }
    }
}
