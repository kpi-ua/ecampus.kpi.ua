using Campus.Core.Pulse.EventsArgs;
using System;
using System.Net.Http;
using Campus.Core.Pulse.Attributes;
using Campus.Core.Pulse.Pulse;

namespace Campus.Core.Pulse.Interfaces
{
    public interface IServerSentEvent
    {
        /// <summary>
        /// Sends a message to all subscribers.
        /// </summary>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        void Send(string eventType = null, object data = null, string messageId = null);

        /// <summary>
        /// Sends a message to specified clients.
        /// </summary>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        /// <param name="clientIds">Array of client id</param>
        void Send(string eventType = null, object data = null, string messageId = null, int[] clientIds = null);

        /// <summary>
        /// Invokes on heartbeat
        /// </summary> 
        event EventHandler<BeatEventArgs> OnHeartbeat;

        /// <summary>
        /// Invokes on message send
        /// </summary>
        event EventHandler<MessageEventArgs> OnMessageSend;

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
