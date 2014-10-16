using System;

namespace Campus.Core.Pulse.Common.Exceptions
{
    /// <summary>
    /// There's no way to generate compilation errors from code.
    /// So this exception can help to show that class user do not implement something correctly.
    /// </summary>
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
