using System;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    [Serializable]
    public abstract class Element
    {
        [XmlAttribute("name")]
        public string Name { get; set; }
    }
}
