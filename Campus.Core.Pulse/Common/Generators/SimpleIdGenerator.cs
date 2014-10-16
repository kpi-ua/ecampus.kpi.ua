using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Campus.Core.Pulse.Common.BaseClasses;
using Campus.Core.Pulse.Interfaces;

namespace Campus.Core.Common.Generators
{
    public class SimpleIdGenerator : AbstractSingleton<SimpleIdGenerator>, IMessageIdGenerator
    {
        #region Members       

        private int mCounter;

        #endregion


        /// <summary>
        /// Prevents a default instance of the <see cref="SimpleIdGenerator"/> class from being created.
        /// </summary>
        private SimpleIdGenerator()
        {
            mCounter = 0;
        }


        /// <summary>
        /// Generate a new id for the given message.
        /// </summary>
        /// <returns>
        /// The generated id.
        /// </returns>
        public string GetNextId()
        {            
            return Interlocked.Increment(ref mCounter).ToString();
        }


        /// <summary>
        /// Gets the last identifier.
        /// </summary>
        /// <returns></returns>
        public string GetLastId()
        {
            return mCounter.ToString();
        }
    }
}
