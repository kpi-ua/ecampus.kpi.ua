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
        public static object Construct(this Type type, Type[] paramTypes, object[] paramValues, BindingFlags flags)
        {
            Type t = type;
            ConstructorInfo ci = t.GetConstructor(flags, null, paramTypes, null);

            return ci.Invoke(paramValues);
        }

        public static object Construct(this Type type)
        {
            return Activator.CreateInstance(type, BindingFlags.Instance | BindingFlags.NonPublic, null, null, null);
        }
    }
}
