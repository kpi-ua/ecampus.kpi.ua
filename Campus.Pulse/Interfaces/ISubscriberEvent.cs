using Campus.Core.EventsArgs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Campus.Pulse;
using Campus.Core.Common.Attributes;

namespace Campus.Core.Interfaces
{
    public interface ISubscriberEvent
    {
        /// <summary>
        /// Raised when a new client is subrscribing.
        /// </summary>
        event EventHandler<SubscriberEventArgs> SubscriberAdded;
        /// <summary>
        /// Raised when a client has ended its subrscription.
        /// </summary>
        event EventHandler<SubscriberEventArgs> SubscriberRemoved;
        /// <summary>
        /// Makes a client a subscriber of this event.
        /// </summary>
        /// <param name="request">The incomming request from the client.</param>
        /// <returns>The response to send back to the client.</returns>
        [NonSerializableMethodAttribute]
        HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null, Campus.Pulse.ServerSendEvent.ContentType type = ServerSendEvent.ContentType.Text);
    }
}
