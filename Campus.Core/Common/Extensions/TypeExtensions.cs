using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Extensions
{
    public static class TypeExtensions
    {      
        /// <summary>
        /// Constructs the specified type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        public static object Construct(this Type type)
        {
            return Activator.CreateInstance(type, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public, null, null, null);
        }
    }
}
