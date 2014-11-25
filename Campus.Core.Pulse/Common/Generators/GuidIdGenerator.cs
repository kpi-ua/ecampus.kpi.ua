using System;
using Campus.Core.Common.BaseClasses;
using Campus.Core.Pulse.Interfaces;

namespace Campus.Core.Common.Generators
{
    public class GuidIdGenerator : AbstractSingleton<GuidIdGenerator>, IMessageIdGenerator
    {

        /// <summary>
        /// Prevents a default instance of the <see cref="GuidIdGenerator"/> class from being created.
        /// </summary>
        private GuidIdGenerator()
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
            return Guid.NewGuid().ToString();
        }
    }
}
