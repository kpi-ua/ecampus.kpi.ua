using Campus.Core.Interfaces;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.BaseClasses;

namespace Campus.Pulse
{
    internal class MessageHistory : ASingleton<MessageHistory>, IMessageHistory
    {
        private object mQueueLock = new object();
        private ConcurrentQueue<IMessage> mQueue = null;

        private MessageHistory()
        {
            mQueue = new ConcurrentQueue<IMessage>();
        }

        public IMessage GetNextMessage(string messageId)
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
            return null;
        }

        public void Add(IMessage message)
        {
            mQueue.Enqueue(message);
        }
    }
}
