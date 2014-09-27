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
        /// <param name="paramTypes">The parameter types.</param>
        /// <param name="paramValues">The parameter values.</param>
        /// <param name="flags">The flags.</param>
        /// <returns></returns>
        public static object Construct(this Type type, Type[] paramTypes, object[] paramValues, BindingFlags flags)
        {
            Type t = type;
            ConstructorInfo ci = t.GetConstructor(flags, null, paramTypes, null);

            return ci.Invoke(paramValues);
        }


        /// <summary>
        /// Constructs the specified type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        public static object Construct(this Type type)
        {
            return Activator.CreateInstance(type, BindingFlags.Instance | BindingFlags.NonPublic, null, null, null);
        }
    }
}
