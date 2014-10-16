using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Interfaces;
using Campus.Core.Common.BaseClasses;
using Campus.Core.Common.Extensions;

namespace Campus.Core.Common.Generators
{
    public class UnixTimeIdGenerator : AbstractSingleton<UnixTimeIdGenerator>, IMessageIdGenerator
    {

        /// <summary>
        /// Prevents a default instance of the <see cref="UnixTimeIdGenerator"/> class from being created.
        /// </summary>
        private UnixTimeIdGenerator()
        {

        }


        /// <summary>
        /// Generate a new id for the given message.
        /// </summary>
        /// <returns>
        /// The generated id.
        /// </returns>
        public string GetNextId()
        {
            return ((int)DateTime.UtcNow.ToUnixTime()).ToString();
        }


        /// <summary>
        /// To the unix time.
        /// </summary>
        /// <param name="time">The time.</param>
        /// <returns></returns>
        public double ToUnixTime(DateTime time)
        {
            return (time - new DateTime(1970, 1, 1)).TotalSeconds;
        }


        /// <summary>
        /// Parses the unix time.
        /// </summary>
        /// <param name="msg">The MSG.</param>
        /// <returns></returns>
        public DateTime ParseUnixTime(IMessage msg)
        {
            return ParseUnixTime(msg.Id);
        }


        /// <summary>
        /// Parses the unix time.
        /// </summary>
        /// <param name="unixTime">The unix time.</param>
        /// <returns></returns>
        public DateTime ParseUnixTime(int unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(unixTime);
        }


        /// <summary>
        /// Parses the unix time.
        /// </summary>
        /// <param name="unixTime">The unix time.</param>
        /// <returns></returns>
        public DateTime ParseUnixTime(double unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(unixTime);
        }


        /// <summary>
        /// Parses the unix time.
        /// </summary>
        /// <param name="unixTime">The unix time.</param>
        /// <returns></returns>
        public DateTime ParseUnixTime(string unixTime)
        {
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(int.Parse(unixTime));
        }
    }
}
