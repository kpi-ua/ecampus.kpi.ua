using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Attributes
{

    [AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = true)]
    public sealed class NonSerializableMethodAttribute : AbstractAttribute
    {        
        /// <summary>
        /// Initializes a new instance of the <see cref="NonSerializableMethodAttribute"/> class.
        /// </summary>
        public NonSerializableMethodAttribute()
        {            
        }        
    }

    [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false, Inherited = false)]
    public sealed class NonSerializableParameterAttribute : AbstractAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NonSerializableParameterAttribute"/> class.
        /// </summary>
        public NonSerializableParameterAttribute()
        {
        }
    }
}
