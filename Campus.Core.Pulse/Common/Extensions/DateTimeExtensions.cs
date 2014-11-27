using System;
using Campus.Core.Common.Generators;

namespace Campus.Core.Pulse.Common.Extensions
{
    public static class DateTimeExtensions
    {

        /// <summary>
        /// Converts datetime to the unix time.
        /// </summary>
        /// <param name="time">The time.</param>
        /// <returns></returns>
        public static double ToUnixTime(this DateTime time)
        {
            return UnixTimeIdGenerator.Instance.ToUnixTime(time);
        }
    }
}
