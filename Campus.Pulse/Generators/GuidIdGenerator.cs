using Campus.Core.Common.BaseClasses;
using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Generators
{
    public class GuidIdGenerator : ASingleton<GuidIdGenerator>, IMessageIdGenerator
    {
        private GuidIdGenerator()
        {

        }

        public string GetNextId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
