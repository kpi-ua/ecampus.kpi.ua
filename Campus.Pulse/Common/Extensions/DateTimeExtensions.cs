using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Generators;

namespace Campus.Core.Common.Extensions
{
    public static class DateTimeExtensions
    {
        public static double ToUnixTime(this DateTime time)
        {
            return UnixTimeIdGenerator.Instance.ToUnixTime(time);
        }
    }
}
