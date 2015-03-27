using System.Collections.Generic;

namespace Campus.Core.Documentation
{
    public class MethodDescription : Element
    {
        public MethodDescription()
        {
            Parameters = new List<TypeDescription>();
        }

        public string Method { get; set; }
        public string Description { get; set; }
        public object Compression { get; set; }
        public IEnumerable<TypeDescription> Parameters { get; set; }
    }
}
