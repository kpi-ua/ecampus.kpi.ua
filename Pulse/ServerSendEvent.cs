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
using System.Reflection;
using System.Web.Mvc;
using Campus.Core.Common.Attributes;
using Campus.Core.BaseClasses;


namespace Campus.Pulse
{
    public abstract class ServerSendEvent : System.Web.Http.ApiController, IServerSentEvent
    {
        #region Events

        /// <summary>
        /// Invokes when new subscriber was added
        /// </summary>
        public virtual event EventHandler<SubscriberEventArgs> SubscriberAdded;

        /// <summary>
        /// Invokes on subscriber removing
        /// </summary>
        public virtual event EventHandler<SubscriberEventArgs> SubscriberRemoved;

        /// <summary>
        /// Invokes on heartbeat
        /// </summary>        
        public virtual event EventHandler<BeatEventArgs> OnHeartbeat;

        /// <summary>
        /// Invokes on message send
        /// </summary>
        public event EventHandler<MessageEventArgs> OnMessageSend;
        #endregion

        #region Members

        internal List<Client> _Clients = new List<Client>();
        internal object _Lock = new object();
        internal IMessageHistory _MessageHistory = null;
        private IMessageIdGenerator _IdGenerator = null;
        private int _HeartbeatInterval = 0;
        private Timer _HeartbeatTimer = null;

        #endregion

        #region Properties

        /// <summary>
        /// Allow requests from other domains
        /// </summary>
        /// value = true
        public static bool EnableCrossDomainRequest { get; set; }

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

        #region c'tors


        /// <summary>
        /// Initializes a new instance of the <see cref="ServerSendEvent"/> class.
        /// </summary>
        /// <param name="generateMessageIds">if set to <c>true</c> [generate message ids].</param>
        /// <param name="idGenerator">The identifier generator.</param>
        /// <param name="heartbeatInterval">The heartbeat interval.</param>
        protected ServerSendEvent(bool generateMessageIds = false, MessageIdGenerator? idGenerator = null, int heartbeatInterval = 0)
            : this()
        {
            _HeartbeatInterval = heartbeatInterval;
            _MessageHistory = MessageHistory.Instance;
            if (generateMessageIds && idGenerator.HasValue)
                _IdGenerator = GetMessageIdGenerator(idGenerator.Value);

            SetupHeartbeat(heartbeatInterval);
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="ServerSendEvent"/> class.
        /// </summary>
        /// <param name="messageHistory">The message history.</param>
        /// <param name="idGenerator">The identifier generator.</param>
        /// <param name="heartbeatInterval">The heartbeat interval.</param>
        /// <exception cref="System.ArgumentException">
        /// messageHistory can not be null.
        /// or
        /// idGenerator can not be null.
        /// </exception>
        protected ServerSendEvent(IMessageHistory messageHistory, IMessageIdGenerator idGenerator, int heartbeatInterval = 0)
            : this()
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


        /// <summary>
        /// Prevents a default instance of the <see cref="ServerSendEvent"/> class from being created.
        /// </summary>
        private ServerSendEvent()
        {
            EnableCrossDomainRequest = true;
        }

        #endregion

        #region Send

        /// <summary>
        /// Sends a message to all subscribers.
        /// </summary>
        /// <param name="eventType">The type of message.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">Id of the message.</param>
        public virtual void Send(string eventType = null, object data = null, string messageId = null)
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
        public virtual void Send(string eventType = null, object data = null, string messageId = null, int[] clientIds = null)
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
        public virtual void Send(int? clientId, string eventType = null, string data = null, string messageId = null)
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


        /// <summary>
        /// Sends the and remove disconnected.
        /// </summary>
        /// <param name="clientsToSendTo">The clients to send to.</param>
        /// <param name="msg">The MSG.</param>
        /// <param name="clientIds">The client ids.</param>
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
                        clientsToSendTo.Single(c => c.Id == target.ToString()).Send(msg);
                    });
                }
                removed = _Clients.RemoveAll(c => !c.IsConnected);
                count = _Clients.Count;
            }

            Task.Run(() => { if (OnMessageSend != null)OnMessageSend(this, new MessageEventArgs(msg)); });

            if (removed > 0)
                OnSubscriberRemoved(count);
        }

        #endregion

        #region Events

        internal virtual void OnSubscriberAdded(int subscriberCount)
        {
            if (SubscriberAdded != null)
                SubscriberAdded(this, new SubscriberEventArgs(subscriberCount));
        }

        internal virtual void OnSubscriberRemoved(int subscriberCount)
        {
            if (SubscriberRemoved != null)
                SubscriberRemoved(this, new SubscriberEventArgs(subscriberCount));
        }

        internal virtual void OnHBeat(object state)
        {
            if (OnHeartbeat != null)
                OnHeartbeat(this, new BeatEventArgs(state));
        }

        #endregion        

        /// <summary>
        /// Makes a client a subscriber of this event.
        /// </summary>
        /// <param name="request">The incomming request from the client.</param>
        /// <param name="sessionId"></param>
        /// <param name="type"></param>
        /// <returns>
        /// The response to send back to the client.
        /// </returns>
        public virtual HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null, ContentType type = ContentType.Text)
        {
            HttpResponseMessage response = request.CreateResponse();
            AddHeaders(response);
            response.Content = new PushStreamContent((stream, content, context) =>
            {
                string lastMessageId = GetLastMessageId(content);
                Client client = new Client(GetClientId(sessionId), stream, lastMessageId);

                AddClient(client);

            }, GetContentType(type));
            return response;
        }


        /// <summary>
        /// Adds cross-domain headers.
        /// </summary>
        /// <param name="response">The response.</param>
        internal virtual void AddHeaders(HttpResponseMessage response)
        {
            if (EnableCrossDomainRequest)
                response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Cache-Control", "no-cache, must-revalidate");
        }


        /// <summary>
        /// Adds the client.
        /// </summary>
        /// <param name="client">The client.</param>
        internal virtual void AddClient(Client client)
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


                OnSubscriberAdded(count);

                // Send all messages since LastMessageId
                IMessage nextMessage = null;
                while ((nextMessage = _MessageHistory.GetNextMessage(client.LastMessageId)) != null)
                    client.Send(nextMessage);
            }
        }


        /// <summary>
        /// Gets the last message identifier.
        /// </summary>
        /// <param name="content">The content.</param>
        /// <returns></returns>
        internal protected string GetLastMessageId(HttpContent content)
        {
            string id = string.Empty;
            IEnumerable<string> values = new List<string>();
            if (content.Headers.TryGetValues(@"Last-Event-ID", out values))
                id = values.FirstOrDefault();

            return id;
        }


        /// <summary>
        /// Checks the message.
        /// </summary>
        /// <param name="msg">The MSG.</param>
        internal void CheckMessage(Message msg)
        {
            // Add id?
            if (string.IsNullOrWhiteSpace(msg.Id) && _IdGenerator != null && !Message.IsOnlyComment(msg))
                msg.Id = _IdGenerator.GetNextId();

            // Add retry?
            if (_HeartbeatTimer != null)
                msg.Retry = _HeartbeatInterval.ToString();
        }


        /// <summary>
        /// Setups the heartbeat.
        /// </summary>
        /// <param name="heartbeatInterval">The heartbeat interval.</param>
        internal void SetupHeartbeat(int heartbeatInterval)
        {
            if (heartbeatInterval > 0)
            {
                _HeartbeatTimer = new Timer(TimerCallback, null, 1000, heartbeatInterval);
            }
        }


        /// <summary>
        /// Timer's callback.
        /// </summary>
        /// <param name="state">The state.</param>
        internal virtual void TimerCallback(object state)
        {
            OnHBeat(state);

            Send(new Message() { Comment = "heartbeat" });
        }


        /// <summary>
        /// Validates the user.
        /// </summary>
        /// <param name="sessionId">The session identifier.</param>
        /// <param name="user">The user.</param>
        /// <exception cref="System.Web.HttpException">Access denied</exception>
        [NonSerializableMethod]
        protected virtual void ValidateUser(string sessionId, dynamic user)
        {
            if (String.IsNullOrEmpty(sessionId) || user == null)
            {
                throw new HttpException(Convert.ToInt32(HttpStatusCode.Forbidden), "Access denied");
            }
        }


        /// <summary>
        /// Introspects this instance.
        /// </summary>
        /// <returns></returns>
        [NonSerializableMethod]
        public virtual HttpResponseMessage Introspect()
        {
            //Default Introspect implementation

            var methods = (from method in GetType().GetMethods()
                           where
                               method.ReturnType == typeof(HttpResponseMessage)
                               && method.IsPublic
                               && !NonSerializableMethodAttribute.Instance.HasAttribute(method, typeof(NonSerializableMethodAttribute))
                           select IntrospectMethod(method)).ToList();

            var executingAssembly = Assembly.GetExecutingAssembly();

            var name = executingAssembly.GetName();

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                StatusCode = HttpStatusCode.OK,
                TimeStamp = DateTime.Now,
                Guid = Guid.NewGuid(),
                ApiVersion = name.Version.ToString(),
                Methods = methods
            });
        }


        /// <summary>
        /// Introspects the method.
        /// </summary>
        /// <param name="method">The method.</param>
        /// <returns></returns>
        protected static dynamic IntrospectMethod(MethodInfo method)
        {
            var isHttPost = method.CustomAttributes.Any(o => o.AttributeType.Name == "HttpPostAttribute");
            var isDescription = DescriptionAttribute.Instance.HasAttribute(method);

            return new
            {
                method.Name,
                Method = isHttPost ? "POST" : "GET",
                Description = isDescription ? ((DescriptionAttribute)method.GetCustomAttributes().First(o => (string)o.TypeId == "DescriptionAttribute")).Description : null,
                Parameters = method.GetParameters().Where(p => !NonSerializableParameterAttribute.Instance.HasAttribute(p)).Select(o => new
                {
                    o.Name,
                    Type = o.ParameterType.ToString(),
                }).ToList()
            };
        }
    }
}
