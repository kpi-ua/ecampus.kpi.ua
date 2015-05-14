using System.Xml.Serialization;

namespace Campus.SDK.Documentation
{
    [XmlRoot(ElementName = "param")]
    public class Param : Element
    {
        [XmlText]
        public string Value { get; set; }
    }
}
