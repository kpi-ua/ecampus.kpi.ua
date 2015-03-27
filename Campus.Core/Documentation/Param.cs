using System;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    [Serializable]
    [XmlRoot(ElementName = "param")]
    public class Param : Element
    {
        [XmlText]
        public string Value { get; set; }
    }
}
