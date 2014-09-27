using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Exceptions
{
    [Serializable]
    public class ArchitectureException : Exception
    {
        public ArchitectureException() { }
        public ArchitectureException(string message) : base(message) { }
        public ArchitectureException(string message, Exception inner) : base(message, inner) { }
        protected ArchitectureException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context)
            : base(info, context) { }
    }
}
