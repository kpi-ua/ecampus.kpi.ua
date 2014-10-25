using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core
{
    public static class StaticExtend
    {   
        public static string ToStringList<T>(this IEnumerable<T> list, Func<T, string> func)
        {
            return list.Aggregate("", (current, item) => current + (func(item) + "\n"));
        }
    }
}
