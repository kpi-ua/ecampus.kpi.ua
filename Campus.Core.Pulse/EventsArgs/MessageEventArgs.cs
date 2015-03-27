using System;
using Campus.Core.Pulse.Interfaces;

namespace Campus.Core.Pulse.EventsArgs
{
    public class MessageEventArgs : EventArgs
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageEventArgs"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public MessageEventArgs(IMessage message)
        {
            this.Message = message;
            this.Time = DateTime.Now;
        }

        public IMessage Message { get; private set; }
        public DateTime Time { get; private set; }
    }
}
