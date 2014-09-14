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
using Campus.Core;
using System.Net;


namespace Campus.Pulse
{
    public abstract class ServerSendEvent : ApiController, IServerSentEvent
    {
        #region Events

        /// <summary>
        /// Invokes when new subscriber was added
        /// </summary>
        public event EventHandler<SubscriberEventArgs> SubscriberAdded;

        /// <summary>
        /// Invokes on subscriber removing
        /// </summary>
        public event EventHandler<SubscriberEventArgs> SubscriberRemoved;

        /// <summary>
        /// Invokes on heartbeat
        /// </summary>
        public event Action OnHeartbeat;

        /// <summary>
        /// Invokes on message send
        /// </summary>
        public event EventHandler<MessageEventArgs> OnMessageSend;
        #endregion


        #region Members

        protected List<Client> _Clients = new List<Client>();
        protected object _Lock = new object();
        protected IMessageHistory _MessageHistory = null;
        protected IMessageIdGenerator _IdGenerator = null;
        protected static readonly slf4net.ILogger _logger = slf4net.LoggerFactory.GetLogger(typeof(ServerSendEvent));
        protected int _HeartbeatInterval = 0;
        protected Timer _HeartbeatTimer = null;

        #endregion        

        #region Abstract Methods        

        public abstract int GetClientId(string sessionId);
        #endregion

        #region Emuns

        public enum MessageIdGenerator
        {
            Simple = 1,
            Guid = 2,
            UnixTime = 3
        }

        public enum ContentType
        {
            Text = 1,
            JSON = 2,
        }

        protected IMessageIdGenerator GetMessageIdGenerator(MessageIdGenerator messageGeneratorType)
        {
            switch (messageGeneratorType)
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

        protected string GetContentType(ContentType type)
        {
            switch (type)
            {
                case ContentType.Text:
                    return "text/event-stream";
                case ContentType.JSON:
                    return "application/json";
            }
            return null;
        }

        #endregion

        protected ServerSendEvent(bool generateMessageIds = false, MessageIdGenerator? idGenerator = null, int heartbeatInterval = 0)
        {
            _HeartbeatInterval = heartbeatInterval;
            _MessageHistory = MessageHistory.Instance;
            if (generateMessageIds && idGenerator.HasValue)
                _IdGenerator = GetMessageIdGenerator(idGenerator.Value);

            SetupHeartbeat(heartbeatInterval);
        }

        protected ServerSendEvent(IMessageHistory messageHistory, IMessageIdGenerator idGenerator, int heartbeatInterval = 0)
        {
            if (messageHistory == null)
                throw new ArgumentException("messageHistory can not be null.");

            if (idGenerator == null)
                throw new ArgumentException("idGenerator can not be null.");

            _MessageHistory = messageHistory;
            _IdGenerator = idGenerator;
            _HeartbeatInterval = heartbeatInterval;

            SetupHeartbeat(heartbeatInterval);
        }

        public virtual HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null, ContentType type = ContentType.Text)
        {
            HttpResponseMessage response = request.CreateResponse();
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Cache-Control", "no-cache, must-revalidate");
            response.Content = new PushStreamContent((stream, content, context) =>
            {
                string lastMessageId = GetLastMessageId(content);
                Client client = new Client(GetClientId(sessionId), stream, lastMessageId);

                AddClient(client);

            }, GetContentType(type));
            return response;
        }

        protected virtual void AddClient(Client client)
        {
            int count = 0;
            lock (_Lock)
            {
                if (_Clients.Any(c => c.Id == client.Id))
                {
                    var oldClient = _Clients.First(c => c.Id == client.Id);
                    _Clients.Remove(oldClient);
                }
                _Clients.Add(client);
                count = _Clients.Count;
            }

            OnSubscriberAdded(count);

            // Send all messages since LastMessageId
            IMessage nextMessage = null;
            while ((nextMessage = _MessageHistory.GetNextMessage(client.LastMessageId)) != null)
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
            lock (_Lock)
            {
                SendAndRemoveDisconneced(_Clients, msg, clientIds);
            }
        }

        protected void SendAndRemoveDisconneced(List<Client> clientsToSendTo, Message msg, int[] clientIds = null)
        {
            CheckMessage(msg);

            int removed = 0;
            int count = 0;
            lock (_Lock)
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
                removed = _Clients.RemoveAll(c => !c.IsConnected);
                count = _Clients.Count;
            }

            Task.Run(() => { OnMessageSend(this, new MessageEventArgs(msg)); });

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
            if (string.IsNullOrWhiteSpace(msg.Id) && _IdGenerator != null && !Message.IsOnlyComment(msg))
                msg.Id = _IdGenerator.GetNextId();

            // Add retry?
            if (_HeartbeatTimer != null)
                msg.Retry = _HeartbeatInterval.ToString();
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
                _HeartbeatTimer = new Timer(TimerCallback, null, 1000, heartbeatInterval);
            }
        }

        private void TimerCallback(object state)
        {
            if (OnHeartbeat != null)
                OnHeartbeat.AsyncInvoke();

            Send(new Message() { Comment = "heartbeat" });
        }
    }
}
