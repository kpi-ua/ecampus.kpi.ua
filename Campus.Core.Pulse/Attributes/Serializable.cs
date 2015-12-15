using System;

namespace Campus.Core.Pulse.Attributes
{
    /// <summary>
    /// Indicates that marked method wouldn't be serialized
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = true)]
    public sealed class NonSerializableMethodAttribute : AbstractAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NonSerializableMethodAttribute"/> class.
        /// </summary>
        public NonSerializableMethodAttribute()
        {
        }

        private static NonSerializableMethodAttribute _instance = null;
        public static NonSerializableMethodAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new NonSerializableMethodAttribute();
                return _instance;
            }
        }
    }

    /// <summary>
    /// Indicates that marked class wouldn't be serialized
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = true)]
    public sealed class NonSerializableClassAttribute : AbstractAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NonSerializableClassAttribute"/> class.
        /// </summary>
        public NonSerializableClassAttribute()
        {
        }

        private static NonSerializableClassAttribute _instance = null;
        public static NonSerializableClassAttribute Instance
        {
            get
            {
                if (_instance == null) _instance = new NonSerializableClassAttribute();
                return _instance;
            }
        }
    }

    /// <summary>
    /// Indicates that marked parameter wouldn't be serialized
    /// </summary>
    [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false, Inherited = false)]
    public sealed class NonSerializableParameterAttribute : AbstractAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NonSerializableParameterAttribute"/> class.
        /// </summary>
        public NonSerializableParameterAttribute()
        {
        }

        private static NonSerializableParameterAttribute _instance = null;
        
        public static NonSerializableParameterAttribute Instance
        {
            get { return _instance ?? (_instance = new NonSerializableParameterAttribute()); }
        }
    }
}