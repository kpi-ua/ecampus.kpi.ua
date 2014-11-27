using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class XmlContainer
    {
        [XmlText]
        public string Value { get; set; }

        public override string ToString()
        {
            return Value;
        }
    }
}
