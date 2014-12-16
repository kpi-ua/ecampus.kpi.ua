using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    [Serializable]
    [XmlType(TypeName = "assembly")]
    public class Assembly
    {
        [XmlElement("name")]
        public string Name { get; set; }
    }
}
