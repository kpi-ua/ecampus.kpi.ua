using System;
using System.Net.Http;
using Campus.Core.Attributes;
using Campus.Core.EventsArgs;
using Campus.Core.Pulse.Attributes;
using Campus.Core.Pulse.EventsArgs;
using Campus.Core.Pulse.Pulse;

namespace Campus.Core.Pulse.Interfaces
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
        /// <param name="request">The incoming request from the client.</param>
        /// <returns>The response to send back to the client.</returns>
        [NonSerializableMethod]
        HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null, ServerSendEvent.ContentType type = ServerSendEvent.ContentType.Text);
    }
}
