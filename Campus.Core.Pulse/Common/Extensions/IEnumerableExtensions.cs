using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Campus.Core.Common.Extensions
{
    public static class IEnumerableExtensions
    {
        public static void ForEach<T>(this IEnumerable<T> source, Action<T> body)
        {
            var exceptions = new List<Exception>(); ;

            foreach (var item in source)
            {
                try
                {
                    body(item);
                }
                catch (Exception exc)
                {
                    exceptions.Add(exc);
                }
            }
            if (exceptions.Count != 0)
            {
                throw new AggregateException(exceptions);
            }
        }

        public static Task ForEachAsync<T>(this IEnumerable<T> source, Action<T> body)
        {
            return Task.WhenAll(
                from item in source
                select Task.Run(() => body(item)));
        }

    }
}
