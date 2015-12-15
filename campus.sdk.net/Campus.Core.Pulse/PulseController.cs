using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Campus.Core.Pulse.Attributes;
using Campus.Core.Pulse.EventsArgs;
using Campus.Core.Pulse.Interfaces;
using Campus.Core.Pulse.Pulse;
using Campus.Core.Pulse.Common.Extensions;
using Campus.SDK;
using Client = Campus.Core.Pulse.Pulse.Client;

namespace Campus.Core.Pulse
{
    /// <summary>
    /// Functionality for handling and sending a Server-Sent Events from ASP.NET WebApi.
    /// </summary>
    /// <typeparam name="TClientInfo">Type to carry additional information for each client/subscriber.</typeparam>
    public abstract class PulseController<TClientInfo> : ServerSendEvent, IGet, IApiController
        where TClientInfo : class
    {
        #region c'tors

        /// <summary>
        /// Initializes a new instance of the <see cref="PulseController{ClientInfo}"/> class.
        /// </summary>
        /// <param name="generateMessageIds">If set to <c>true</c> [generate message ids].</param>
        /// <param name="idGenerator">The identifier generator.</param>
        /// <param name="heartbeatInterval">The heartbeat interval in milliseconds.</param>
        public PulseController(bool generateMessageIds = false, MessageIdGenerator? idGenerator = null, int heartbeatInterval = 0)
            : base(generateMessageIds, idGenerator, heartbeatInterval)
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="PulseController{ClientInfo}"/> class.
        /// </summary>
        /// <param name="messageHistory">The message history.</param>
        /// <param name="idGenerator">The identifier generator.</param>
        /// <param name="heartbeatInterval">The heartbeat interval in milliseconds.</param>
        public PulseController(IMessageHistory messageHistory, IMessageIdGenerator idGenerator, int heartbeatInterval = 0)
            : base(messageHistory, idGenerator, heartbeatInterval)
        { }

        #endregion c'tors

        #region Factory

        /// <summary>
        /// Represents a basic pulse class
        /// </summary>
        [NonSerializableClass]
        public class PulseObject<TObjectInfo> : PulseController<TObjectInfo>, IPulseObject where TObjectInfo
            : class
        {
            public int Id { get { return typeof(TObjectInfo).GetHashCode(); } }

            private readonly Func<TObjectInfo> _getUser = null;

            internal PulseObject(Func<TObjectInfo> getFunc, bool generateMessageIds = true, MessageIdGenerator? idGenerator = ServerSendEvent.MessageIdGenerator.Simple, int heartbeatInterval = 5000)
                : base(generateMessageIds, idGenerator, heartbeatInterval)
            {
                _getUser = getFunc;
            }

            public override bool Equals(object obj)
            {
                return this.GetHash().Equals(obj.GetHash());

            }

            public override TObjectInfo GetUser(string sessionId)
            {
                return _getUser();
            }

            public override int GetClientId(string sessionId)
            {
                return GetUser(sessionId).GetHash();
            }
        }

        /// <summary>
        /// Factory to create pulse objects to use in classes that are not derived from <see cref="PulseController{ClientInfo}"/>
        /// </summary>
        /// <value>
        /// The factory.
        /// </value>
        public static PulseFactory<TClientInfo> Factory { get { return PulseFactory<TClientInfo>.Instance; } }

        #endregion

        #region Events

        public new event EventHandler<SubscriberEventArgs<Client>> SubscriberAdded;

        internal void OnSubscriberAdded(int subscriberCount, Client client)
        {
            if (SubscriberAdded != null)
                SubscriberAdded(this, new SubscriberEventArgs<Client>(client, subscriberCount));
        }

        public new event EventHandler<SubscriberEventArgs<Client>> SubscriberRemoved;

        internal void OnSubscriberRemoved(int subscriberCount, Client client)
        {
            if (SubscriberRemoved != null)
                SubscriberRemoved(this, new SubscriberEventArgs<Client>(client, subscriberCount));
        }

        public new event EventHandler<BeatEventArgs<TClientInfo>> OnHeartbeat;

        internal void OnHBeat(object state, TClientInfo client)
        {
            if (OnHeartbeat != null)
                OnHeartbeat(this, new BeatEventArgs<TClientInfo>(state, client));
        }

        internal override void TimerCallback(object state)
        {
            _Clients.ForEachAsync((c) =>
            {
                OnHBeat(state, ((ClientWithInformation<TClientInfo>)c).Info);
            });

            Send(new Message() { Comment = "heartbeat" });
        }

        #endregion Events

        #region Abstracts

        /// <summary>
        /// Gets the user.
        /// </summary>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public virtual TClientInfo GetUser(string sessionId)
        {
            throw new Exception("You must override GetUser method in client code");
        }

        /// <summary>
        /// Gets the client identifier.
        /// </summary>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public override int GetClientId(string sessionId)
        {
            throw new NotImplementedException();
        }

        #endregion Abstracts

        #region Get

        /// <summary>
        /// Get request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns>Message stream</returns>
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        [Attributes.Description("Get request. Returns new event-stream.")]
        public virtual HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request, string sessionId)
        {
            return AddSubscriber(request, sessionId, ContentType.Text);
        }

        /// <summary>
        /// Gets request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>Information about controller's methods</returns>
        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        [NonSerializableMethod]
        public virtual HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request)
        {
            return Introspect();
        }

        #endregion Get

        #region Send

        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, Func<TClientInfo, bool> criteria)
        {
            Send(new Message() { Data = data }, criteria);
        }

        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, string eventType, Func<TClientInfo, bool> criteria)
        {
            Send(new Message() { EventType = eventType, Data = data }, criteria);
        }

        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="eventType">The type of event.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, string eventType, string messageId, Func<TClientInfo, bool> criteria)
        {
            Send(new Message() { EventType = eventType, Data = data, Id = messageId }, criteria);
        }

        #endregion Send

#if DEBUG

        public HttpRequestMessage RequestM { get { return Request; } set { Request = value; } }

#endif

        /// <summary>
        /// Adds the subscriber.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="clientInfo">The client information.</param>
        /// <param name="contentType">Type of the content.</param>
        /// <returns>Response message</returns>
        private HttpResponseMessage AddSubscriber(HttpRequestMessage request, TClientInfo clientInfo, ContentType contentType = ContentType.Text)
        {
            HttpResponseMessage response = request.CreateResponse();
            AddHeaders(response);
            response.Content = new PushStreamContentWithClientInfomation<TClientInfo>((stream, content, context) =>
            {
                TClientInfo info = default(TClientInfo);

                if (content is PushStreamContentWithClientInfomation<TClientInfo>)
                {
                    var contentWithInfo = content as PushStreamContentWithClientInfomation<TClientInfo>;
                    info = contentWithInfo.Info;
                }

                string lastMessageId = GetLastMessageId(content);
                var client = new ClientWithInformation<TClientInfo>(stream, lastMessageId, info);
                AddClient(client);
            }, GetContentType(contentType), clientInfo);
            return response;
        }

        /// <summary>
        /// Adds the subscriber.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="sessionId">The session identifier.</param>
        /// <param name="type">The type.</param>
        /// <returns>Response message</returns>
        [NonSerializableMethod]
        public sealed override HttpResponseMessage AddSubscriber(HttpRequestMessage request, string sessionId = null, ServerSendEvent.ContentType type = ContentType.Text)
        {
            return this.AddSubscriber(request, GetUser(sessionId), type);
        }

        /// <summary>
        /// Sends the specified MSG.
        /// </summary>
        /// <param name="msg">The MSG.</param>
        /// <param name="criteria">The criteria.</param>
        private void Send(Message msg, Func<TClientInfo, bool> criteria)
        {
            lock (_Lock)
            {
                // Only send message to clients fulfilling the criteria
                var filtered = _Clients
                                .Where(c => c is ClientWithInformation<TClientInfo>)
                                    .Where(c =>
                                    {
                                        var clientWithInfo = c as ClientWithInformation<TClientInfo>;
                                        return clientWithInfo.Info == null ? false : criteria(clientWithInfo.Info);
                                    }).ToList();

                SendAndRemoveDisconneced(filtered, msg);
            }
        }

        /// <summary>
        /// Adds the client.
        /// </summary>
        /// <param name="client">The client.</param>
        internal override void AddClient(Client client)
        {
            if (client is ClientWithInformation<TClientInfo>)
            {
                var clientWithInfo = client as ClientWithInformation<TClientInfo>;
                lock (_Lock)
                {
                    if (_Clients.Any(c => ((ClientWithInformation<TClientInfo>)c).Info.Equals(clientWithInfo.Info)))
                    {
                        var oldClient = _Clients.First(c => ((ClientWithInformation<TClientInfo>)c).Id == clientWithInfo.Id);
                        _Clients.Remove(oldClient);
                        OnSubscriberRemoved(_Clients.Count, client);
                    }
                    _Clients.Add(client);
                    OnSubscriberAdded(_Clients.Count, client);
                }

                // Send all messages since LastMessageId
                bool canGet = true;

                do
                {
                    var nextMessage = _MessageHistory.GetNextMessage();
                    if (nextMessage != null && nextMessage.AuthorId.Equals(client.Id))
                        client.Send(nextMessage);
                    else
                        canGet = false;
                } while (canGet);
            }
            else
            {
                base.AddClient(client);
            }
        }

        protected internal class PushStreamContentWithClientInfomation<Data> : PushStreamContent
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="PushStreamContentWithClientInfomation`1"/> class.
            /// </summary>
            /// <param name="onStreamAvailable">The on stream available.</param>
            /// <param name="mediaType">Type of the media.</param>
            /// <param name="clientInfo">The client information.</param>
            public PushStreamContentWithClientInfomation(Action<Stream, HttpContent, System.Net.TransportContext> onStreamAvailable, string mediaType, Data clientInfo)
                : base(onStreamAvailable, mediaType)
            {
                this.Info = clientInfo;
            }

            /// <summary>
            /// Gets the information.
            /// </summary>
            /// <value>
            /// The information.
            /// </value>
            public Data Info { get; private set; }
        }
    }

#if DEBUG

    public class TestUser
    {
        public int Id;

        public TestUser(int id)
        {
            Id = id;
        }
    }

    [NonSerializableClass]
    public class TestClass : PulseController<TestUser>
    {
        public override TestUser GetUser(string sessionId)
        {
            return new TestUser(int.Parse(sessionId));
        }

        public override int GetClientId(string sessionId)
        {
            return int.Parse(sessionId);
        }

        public TestClass()
        {
            var user = GetUser("123");

            OnHeartbeat += (sender, e) =>
            {
                Send(data: "some message", clientIds: new[] { user.Id });
            };
        }

        [AcceptVerbs("GET", "POST")]
        [HttpGet]
        [Attributes.Description("Get request. Returns new event-stream.")]
        public override HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request, string sessionId)
        {
            return AddSubscriber(request, sessionId, ServerSendEvent.ContentType.Text);
        }
    }

#endif
}