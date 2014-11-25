using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.BaseClasses;
using Campus.Core.Pulse.Interfaces;

namespace Campus.Pulse
{
    internal class MessageHistory : AbstractSingleton<MessageHistory>, IMessageHistory
    {
        private object mQueueLock = new object();
        private ConcurrentQueue<IMessage> mQueue = null;


        /// <summary>
        /// Prevents a default instance of the <see cref="MessageHistory"/> class from being created.
        /// </summary>
        private MessageHistory()
        {
            mQueue = new ConcurrentQueue<IMessage>();
        }


        /// <summary>
        /// Get the message that was sent after the given id.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns>
        /// Returns the next message. \nReturns NULL if then given id was the last message or its not possible to calculate next message.
        /// </returns>
        public IMessage GetNextMessage(string messageId = null)
        {
            if (!string.IsNullOrWhiteSpace(messageId))
            {
                var enumerator = mQueue.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    if (string.Compare(enumerator.Current.Id, messageId, true) == 0)
                    {
                        if (enumerator.MoveNext())
                            return enumerator.Current;
                    }
                }
            }
            else
            {
                IMessage msg = null;
                if(mQueue.TryDequeue(out msg))
                    return msg;
            }
            return null;
        }


        /// <summary>
        /// Add message to queue
        /// </summary>
        /// <param name="message"></param>
        public void Add(IMessage message)
        {
            mQueue.Enqueue(message);
        }
    }
}
