using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Interfaces;
using System.Net.Http;
using System.IO;

namespace Campus.Pulse
{
    /// <summary>
    /// Functionallity for handling and sending a Server-Sent Events from ASP.NET WebApi.
    /// </summary>
    /// <typeparam name="ClientInfo">Type to carry additional information for each client/subscriber.</typeparam>
    public abstract class PulseController<ClientInfo> : ServerSendEvent
    {
        public PulseController(bool generateMessageIds = false, MessageIdGenerator? idGenerator = null, int heartbeatInterval = 0)
            : base(generateMessageIds, idGenerator, heartbeatInterval)
        { }
        public PulseController(IMessageHistory messageHistory, IMessageIdGenerator idGenerator, int heartbeatInterval = 0)
            : base(messageHistory, idGenerator, heartbeatInterval)
        { }

        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(string data, Func<ClientInfo, bool> criteria) { Send(new Message() { Data = data }, criteria); }
        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(string data, string eventType, Func<ClientInfo, bool> criteria) { Send(new Message() { EventType = eventType, Data = data }, criteria); }
        /// <summary>
        /// Sends data to all subscribers fulfilling the criteria.
        /// </summary>
        /// <param name="eventType">The type of event.</param>
        /// <param name="data">The data to send.</param>
        /// <param name="messageId">The id of the message.</param>
        /// <param name="criteria">The criteria to be fulfilled to get the data.</param>
        public void Send(string data, string eventType, string messageId, Func<ClientInfo, bool> criteria) { Send(new Message() { EventType = eventType, Data = data, Id = messageId }, criteria); }

        public virtual HttpResponseMessage AddSubscriber(HttpRequestMessage request, ClientInfo clientInfo, string sessionId = null)
        {
            HttpResponseMessage response = request.CreateResponse();
            response.Content = new PushStreamContentWithClientInfomation<ClientInfo>(OnStreamAvailable, "text/event-stream", clientInfo);
            return response;
        }

        protected void OnStreamAvailable(Stream stream, System.Net.Http.HttpContent content, System.Net.TransportContext context)
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

        }

        private void Send(Message msg, Func<ClientInfo, bool> criteria)
        {
            lock (mLock)
            {
                // Only send message to clients fullfilling the criteria
                var filtered = mClients
                                .Where(c => c is ClientWithInformation<ClientInfo>)
                                    .Where(c =>
                                    {
                                        var clientWithInfo = c as ClientWithInformation<ClientInfo>;
                                        return clientWithInfo.Info == null ? false : criteria(clientWithInfo.Info);
                                    }).ToList();

                SendAndRemoveDisconneced(filtered, msg);
            }

        }

        protected class ClientWithInformation<Data> : Client
        {
            public ClientWithInformation(Stream stream, string lastMessageId, Data clientInfo)
                : base(null, stream, lastMessageId)
            {
                this.Info = clientInfo;                
            }

            public ClientWithInformation(Stream stream, Data clientInfo)
                : base(null, stream)
            {
                this.Info = clientInfo;
            }

            public Data Info { get; private set; }
        }

        protected class PushStreamContentWithClientInfomation<Data> : PushStreamContent
        {
            public PushStreamContentWithClientInfomation(Action<Stream, HttpContent, System.Net.TransportContext> onStreamAvailable, string mediaType, Data clientInfo)
                : base(onStreamAvailable, mediaType)
            {
                this.Info = clientInfo;
            }

            public Data Info { get; private set; }
        }
    }
}
