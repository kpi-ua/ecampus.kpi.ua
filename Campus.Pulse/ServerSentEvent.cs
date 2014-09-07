using Campus.Core.EventsArgs;
using Campus.Core.Interfaces;
using Campus.Core.Common.Generators;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Campus.Core.Common.BaseClasses;
using Campus.Core.Common.Extensions;


namespace Campus.Pulse
{
    public abstract class ServerSendEvent : IServerSentEvent
    {
        public event EventHandler<SubscriberEventArgs> SubscriberAdded;
        public event EventHandler<SubscriberEventArgs> SubscriberRemoved;

        protected List<Client> mClients = new List<Client>();
        protected object mLock = new object();
        protected IMessageHistory mMessageHistory = null;
        protected IMessageIdGenerator mIdGenerator = null;
        protected static readonly slf4net.ILogger _logger = slf4net.LoggerFactory.GetLogger(typeof(ServerSendEvent));
        protected int mHeartbeatInterval = 0;
        protected Timer mHeartbeatTimer = null;

        public enum MessageIdGenerator
        {
            Simple = 1,
            Guid = 2,
            UnixTime = 3
        }

        public abstract int GetClientId(string sessionId);

        private IMessageIdGenerator GetMessageIdGenerator(MessageIdGenerator messageGeneratorType)
        {
            switch(messageGeneratorType)
            {
                case MessageIdGenerator.Guid:
                    return GuidIdGenerator.Instance;
                case MessageIdGenerator.Simple:
                    return SimpleIdGenerator.Instance;
                case MessageIdGenerator.UnixTime:
                    return UnixTimeIdGenerator.Instance;

            }
            return null;
        }

        protected ServerSendEvent(bool generateMessageIds = false, MessageIdGenerator? idGenerator = null, int heartbeatInterval = 0)
        {
            mHeartbeatInterval = heartbeatInterval;
            mMessageHistory = MessageHistory.Instance;
            if (generateMessageIds && idGenerator.HasValue)
                mIdGenerator = GetMessageIdGenerator(idGenerator.Value);

            SetupHeartbeat(heartbeatInterval);
        }

        protected ServerSendEvent(IMessageHistory messageHistory, IMessageIdGenerator idGenerator, int heartbeatInterval = 0)
        {
            if (messageHistory == null)
                throw new ArgumentException("messageHistory can not be null.");

            if (idGenerator == null)
                throw new ArgumentException("idGenerator can not be null.");

            mMessageHistory = messageHistory;
            mIdGenerator = idGenerator;
            mHeartbeatInterval = heartbeatInterval;

            SetupHeartbeat(heartbeatInterval);
        }

        public virtual HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null)
        {
            HttpResponseMessage response = request.CreateResponse();
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Cache-Control", "no-cache, must-revalidate");
            response.Content = new PushStreamContent((stream, content, context) =>
            {
                string lastMessageId = GetLastMessageId(content);
                Client client = new Client(GetClientId(sessionId), stream, lastMessageId);

                AddClient(client);

            }, "text/event-stream");
            return response;
        }

        protected virtual void AddClient(Client client)
        {
            int count = 0;
            lock (mLock)
            {
                if (mClients.Any(c => c.Id == client.Id))
                {
                    var oldClient = mClients.First(c => c.Id == client.Id);
                    mClients.Remove(oldClient);
                }
                mClients.Add(client);
                count = mClients.Count;
            }

            OnSubscriberAdded(count);

            // Send all messages since LastMessageId
            IMessage nextMessage = null;
            while ((nextMessage = mMessageHistory.GetNextMessage(client.LastMessageId)) != null)
                client.Send(nextMessage);
        }

        protected string GetLastMessageId(HttpContent content)
        {
            string id = string.Empty;
            IEnumerable<string> values = new List<string>();
            if (content.Headers.TryGetValues(@"Last-Event-ID", out values))
                id = values.FirstOrDefault();

            return id;
        }

        /// <summary>
        /// Sends a message to all subscribers.
        /// </summary>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        public virtual void Send(string data, string eventType = null, string messageId = null)
        {
            Send(new Message() { EventType = eventType, Data = data, Id = messageId });
        }

        /// <summary>
        /// Sends a message to specified clients.
        /// </summary>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        /// <param name="clientIds">Array of client id</param>
        public virtual void Send(string data, string eventType = null, string messageId = null, int[] clientIds = null)
        {
            Send(new Message() { EventType = eventType, Data = data, Id = messageId });
        }

        /// <summary>
        /// Sends a message to specified client.
        /// </summary>
        /// <param name="clientId">Id of the client \nCan be null, then sends to all clients</param>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        public virtual void Send(int? clientId, string data, string eventType = null, string messageId = null)
        {
            int[] clientIds = null;
            if (clientId.HasValue)
                clientIds = new[] { clientId.Value };

            Send(new Message() { EventType = eventType, Data = data, Id = messageId }, clientIds);
        }

        protected void Send(Message msg, int[] clientIds = null)
        {
            lock (mLock)
            {
                SendAndRemoveDisconneced(mClients, msg, clientIds);
            }
        }

        protected void SendAndRemoveDisconneced(List<Client> clientsToSendTo, Message msg, int[] clientIds = null)
        {
            CheckMessage(msg);

            int removed = 0;
            int count = 0;
            lock (mLock)
            {
                if (clientIds == null)
                    clientsToSendTo.ForEach(c => c.Send(msg));
                else
                {
                    clientIds.ForEachAsync((target) => 
                    {
                        clientsToSendTo.Single(c => c.Id == target).Send(msg);
                    });
                }
                removed = mClients.RemoveAll(c => !c.IsConnected);
                count = mClients.Count;
            }

            if (removed > 0)
                OnSubscriberRemoved(count);

            if (Message.IsOnlyComment(msg))
                _logger.Trace("Comment: " + msg.Comment + " sent to " + count.ToString() + " clients.");
            else
                _logger.Info("Message: " + msg.Data + " sent to " + count.ToString() + " clients.");
        }

        protected void CheckMessage(Message msg)
        {
            // Add id?
            if (string.IsNullOrWhiteSpace(msg.Id) && mIdGenerator != null && !Message.IsOnlyComment(msg))
                msg.Id = mIdGenerator.GetNextId();

            // Add retry?
            if (mHeartbeatTimer != null)
                msg.Retry = mHeartbeatInterval.ToString();
        }

        protected void OnSubscriberAdded(int subscriberCount)
        {
            _logger.Info("Subscriber added. No of subscribers: " + subscriberCount);

            if (SubscriberAdded != null)
                SubscriberAdded(this, new SubscriberEventArgs(subscriberCount));
        }

        protected void OnSubscriberRemoved(int subscriberCount)
        {
            _logger.Info("Subscriber removed. No of subscribers: " + subscriberCount);

            if (SubscriberRemoved != null)
                SubscriberRemoved(this, new SubscriberEventArgs(subscriberCount));
        }

        protected void SetupHeartbeat(int heartbeatInterval)
        {
            if (heartbeatInterval > 0)
            {
                mHeartbeatTimer = new Timer(TimerCallback, null, 1000, heartbeatInterval);
            }
        }

        private void TimerCallback(object state)
        {
            Send(new Message() { Comment = "heartbeat" });
        }
    }
}
