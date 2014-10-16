using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Extensions
{
    public static class DelegateExtensions
    {

        /// <summary>
        /// Asynchronous the invoke.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <returns></returns>
        public static Task AsyncInvoke(this Action target)
        {
            return Task.Run(() => target());
        }


        /// <summary>
        /// Asynchronous the invoke.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="target">The target.</param>
        /// <param name="obj">The object.</param>
        /// <returns></returns>
        public static Task AsyncInvoke<T>(this Action<T> target, T obj)
        {
            return Task.Run(() => target(obj));
        }


        /// <summary>
        /// Asynchronous the invoke.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="target">The target.</param>
        /// <returns></returns>
        public static Task<T> AsyncInvoke<T>(this Func<T> target)
        {
            return Task.Run(() => target());
        }
    }
}
