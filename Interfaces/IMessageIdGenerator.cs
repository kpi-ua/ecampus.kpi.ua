using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface IMessageIdGenerator
    {
        /// <summary>
        /// Generate a new id for the given message.
        /// </summary>
        /// <returns>The generated id.</returns>
        string GetNextId();
    }    
}
