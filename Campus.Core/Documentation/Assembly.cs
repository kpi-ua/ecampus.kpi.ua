using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class Assembly
    {
        [XmlElement("name")]
        public XmlContainer Name { get; set; }

        public override string ToString()
        {
            return Name.Value;
        }
    }
}
