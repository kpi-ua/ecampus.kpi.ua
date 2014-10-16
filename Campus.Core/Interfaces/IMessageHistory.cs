using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface IMessageHistory
    {
        /// <summary>
        /// Get the message that was sent after the the given id.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns>Returns the next message. \nReturns NULL if then given id was the last message or its not possible to calculate next message.</returns>
        IMessage GetNextMessage(string messageId = null);

        /// <summary>
        /// Add message to queue
        /// </summary>
        /// <param name="message"></param>
        void Add(IMessage message);
    }
}
