using System.Xml.Serialization;

namespace Campus.SDK.Documentation
{
    public abstract class Element
    {
        [XmlAttribute("name")]
        public string Name { get; set; }
    }
}
