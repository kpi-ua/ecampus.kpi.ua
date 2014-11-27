using System;

namespace Campus.Core.Attributes
{
    /// <summary>
    /// Indicates that marked parameter wouldn't be serialized
    /// </summary>
    [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false, Inherited = false)]
    public sealed class NonSerializableParameterAttribute : AbstractAttribute
    {
        private static NonSerializableParameterAttribute _instance = null;

        public static NonSerializableParameterAttribute Instance
        {
            get { return _instance ?? (_instance = new NonSerializableParameterAttribute()); }
        }
    }
}
