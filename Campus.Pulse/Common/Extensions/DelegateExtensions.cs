using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Extensions
{
    public static class DelegateExtensions
    {
        public static Task AsyncInvoke(this Action target)
        {
            return Task.Run(() => target());
        }

        public static Task<T> AsyncInvoke<T>(this Func<T> target)
        {
            return Task.Run(() => target());
        }
    }
}
