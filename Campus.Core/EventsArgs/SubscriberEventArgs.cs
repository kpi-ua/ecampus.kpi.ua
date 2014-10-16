using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.EventsArgs
{
    public class SubscriberEventArgs : EventArgs
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="SubscriberEventArgs"/> class.
        /// </summary>
        /// <param name="subscriberCount">The subscriber count.</param>
        public SubscriberEventArgs(int subscriberCount)
        {            
            this.SubscriberCount = subscriberCount;
        }

        public int SubscriberCount { get; private set; }
    }

    public class SubscriberEventArgs<T> : SubscriberEventArgs
    {
        public T Subscriber { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SubscriberEventArgs{T}"/> class.
        /// </summary>
        /// <param name="subscriber">The subscriber.</param>
        /// <param name="subscriberCount">The subscriber count.</param>
        public SubscriberEventArgs(T subscriber ,int subscriberCount = 1)
            : base(subscriberCount)
        {
            Subscriber = subscriber;
        }
    }
}
