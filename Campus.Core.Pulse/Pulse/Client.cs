using System.ServiceModel;
using Campus.Core.Interfaces;
using System;
using System.IO;
using System.Web;

namespace Campus.Pulse
{
    public class Client
    {
        public StreamWriter StreamWriter { get; private set; }
        public bool IsConnected { get; private set; }
        public bool IsRetrySent { get; private set; }
        public string LastMessageId { get; private set; }
        public virtual string Id { get; private set; }

        public Client(int? id, Stream stream, string lastMessageId)
            : this(id, stream)
        {
            this.LastMessageId = lastMessageId;
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="Client"/> class.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="stream">The stream.</param>
        public Client(int? id, Stream stream)
        {
            StreamWriter streamwriter = new StreamWriter(stream);
            this.StreamWriter = streamwriter;
            IsConnected = true;
            Id = ((id.HasValue)? id.Value : -1).ToString();
        }

        /// <summary>
        /// Send message to user represented by this instance of Client
        /// </summary>
        /// <param name="msg">Message</param>
        public virtual void Send(IMessage msg)
        {
            try
            {
                // Only send retry once for each connection
                if (IsRetrySent)
                    msg.Retry = null;

                var text = msg.ToEventStream();
                StreamWriter.WriteLine(text);
                StreamWriter.Flush();

                if (!Message.IsOnlyComment(msg))
                    LastMessageId = msg.Id;

                if (!string.IsNullOrWhiteSpace(msg.Retry))
                    IsRetrySent = true;
            }
            catch (HttpException ex)
            {
                if (ex.ErrorCode == -2147023667) // The remote host closed the connection. 
                {
                    IsConnected = false;
                }                
            }
            catch (CommunicationException)
            {
                IsConnected = false;
            }
            catch(Exception ex)
            {
                if(ex.HResult == -2146233079)
                {
                    if (msg.Data != null)
                    {
                        msg.AuthorId = this.Id;
                        MessageHistory.Instance.Add(msg);
                    }
                }
            }
        }        
    }

    public class ClientWithInformation<Data> : Client
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

        public override string Id
        {
            get
            {
                return Info.ToString();
            }
        }
    }
}
