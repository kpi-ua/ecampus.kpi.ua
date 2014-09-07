using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Campus.Core.Common.BaseClasses;

namespace Campus.Core.Common.Generators
{
    public class SimpleIdGenerator : ASingleton<SimpleIdGenerator>, IMessageIdGenerator
    {
        #region Members       

        private int mCounter;

        #endregion

        private SimpleIdGenerator()
        {
            mCounter = 0;
        }

        public string GetNextId()
        {            
            return Interlocked.Increment(ref mCounter).ToString();
        }
    }
}
