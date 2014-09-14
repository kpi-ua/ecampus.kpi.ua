using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Interfaces;
using Campus.Core.Common.BaseClasses;

namespace Campus.Core.Common.Generators
{
    public class UnixTimeIdGenerator : ASingleton<UnixTimeIdGenerator>, IMessageIdGenerator
    {
        private UnixTimeIdGenerator()
        {

        }

        public string GetNextId()
        {
            return ((int)ToUnixTime(DateTime.UtcNow)).ToString();
        }

        public double ToUnixTime(DateTime time)
        {
            return (time - new DateTime(1970, 1, 1)).TotalSeconds;
        }

        public DateTime ParseUnixTime(IMessage msg)
        {
            return ParseUnixTime(msg.Id);
        }

        public DateTime ParseUnixTime(int unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(unixTime);
        }

        public DateTime ParseUnixTime(double unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(unixTime);
        }

        public DateTime ParseUnixTime(string unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(int.Parse(unixTime));
        }
    }
}
