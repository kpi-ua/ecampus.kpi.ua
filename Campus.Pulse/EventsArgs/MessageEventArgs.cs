using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Pulse;
using Campus.Core.Interfaces;

namespace Campus.Core.EventsArgs
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
