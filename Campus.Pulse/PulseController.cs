using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Interfaces;
using System.Net.Http;
using System.IO;
using Campus.Core.EventsArgs;
using System.Web.Mvc;
using System.Reflection;
using Campus.Core.Common.Extensions;
using Campus.Pulse.Common.Attributes;

namespace Campus.Pulse
{
    /// <summary>
    /// Functionality for handling and sending a Server-Sent Events from ASP.NET WebApi.
    /// </summary>
    /// <typeparam name="ClientInfo">Type to carry additional information for each client/subscriber.</typeparam>
    public abstract class PulseController<ClientInfo> : ServerSendEvent, IGet
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

        #endregion

        #region Abstracts


        /// <summary>
        /// Gets the user.
        /// </summary>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns></returns>        
        public abstract ClientInfo GetUser(string sessionId);                

        #endregion

        #region Get


        /// <summary>
        /// Get request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns>Message stream</returns>
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpGet]
        public virtual HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request, string sessionId)
        {
            return AddSubscriber(request, sessionId, ContentType.Text);
        }


        /// <summary>
        /// Gets request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>Information about controller's methods</returns>
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpGet]
        public virtual HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request)
        {
            return Introspect();
        }
        #endregion

        #region Send

        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, Func<ClientInfo, bool> criteria) { Send(new Message() { Data = data }, criteria); }
        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, string eventType, Func<ClientInfo, bool> criteria) { Send(new Message() { EventType = eventType, Data = data }, criteria); }
        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="eventType">The type of event.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(object data, string eventType, string messageId, Func<ClientInfo, bool> criteria) { Send(new Message() { EventType = eventType, Data = data, Id = messageId }, criteria); }

        #endregion


        /// <summary>
        /// Adds the subscriber.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="clientInfo">The client information.</param>
        /// <param name="contentType">Type of the content.</param>
        /// <returns>Response message</returns>
        private HttpResponseMessage AddSubscriber(HttpRequestMessage request, ClientInfo clientInfo, ContentType contentType = ContentType.Text)
        {
            HttpResponseMessage response = request.CreateResponse();
            AddHeaders(response);
            response.Content = new PushStreamContentWithClientInfomation<ClientInfo>((stream, content, context) =>
            {
                ClientInfo info = default(ClientInfo);

                if (content is PushStreamContentWithClientInfomation<ClientInfo>)
                {
                    PushStreamContentWithClientInfomation<ClientInfo> contentWithInfo = content as PushStreamContentWithClientInfomation<ClientInfo>;
                    info = contentWithInfo.Info;
                }

                string lastMessageId = GetLastMessageId(content);
                ClientWithInformation<ClientInfo> client = new ClientWithInformation<ClientInfo>(stream, lastMessageId, info);
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
        private void Send(Message msg, Func<ClientInfo, bool> criteria)
        {
            lock (_Lock)
            {
                // Only send message to clients fulfilling the criteria
                var filtered = _Clients
                                .Where(c => c is ClientWithInformation<ClientInfo>)
                                    .Where(c =>
                                    {
                                        var clientWithInfo = c as ClientWithInformation<ClientInfo>;
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
            if (client is ClientWithInformation<ClientInfo>)
            {
                var clientWithInfo = client as ClientWithInformation<ClientInfo>;
                int count = 0;
                lock (_Lock)
                {
                    if (_Clients.Any(c => ((ClientWithInformation<ClientInfo>)c).Info.Equals(clientWithInfo.Info)))
                    {
                        var oldClient = _Clients.First(c => ((ClientWithInformation<ClientInfo>)c).Id == clientWithInfo.Id);
                        _Clients.Remove(oldClient);
                    }
                    _Clients.Add(client);
                    count = _Clients.Count;
                }

                OnSubscriberAdded(count);

                // Send all messages since LastMessageId
                IMessage nextMessage = null;
                bool canGet = true;

                do
                {
                    nextMessage = _MessageHistory.GetNextMessage();
                    if(nextMessage != null && nextMessage.AuthorId.Equals(client.Id))
                        client.Send(nextMessage);
                    else
                        canGet = false;

                }while(canGet);
            }
            else
            {
                base.AddClient(client);
            }
        }


        internal protected class PushStreamContentWithClientInfomation<Data> : PushStreamContent
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
}
