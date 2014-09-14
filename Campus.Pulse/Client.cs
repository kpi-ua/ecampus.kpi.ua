using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Campus.Pulse;
using System.Net;

namespace Campus.Pulse
{
    public class Client
    {
        public StreamWriter StreamWriter { get; private set; }
        public bool IsConnected { get; private set; }
        public bool IsRetrySent { get; private set; }
        public string LastMessageId { get; private set; }
        public int Id { get; private set; }

        public Client(int? id, Stream stream, string lastMessageId)
            : this(id, stream)
        {
            this.LastMessageId = lastMessageId;
        }

        public Client(int? id, Stream stream)
        {
            StreamWriter streamwriter = new StreamWriter(stream);
            this.StreamWriter = streamwriter;
            IsConnected = true;
            Id = (id.HasValue)? id.Value : -1;
        }

        /// <summary>
        /// Send message to user represented by this instance of Client
        /// </summary>
        /// <param name="msg">Message</param>
        public void Send(IMessage msg)
        {
            try
            {
                // Only send retry once for each connection
                if (IsRetrySent)
                    msg.Retry = null;

                var text = msg.ToEventStream();
                StreamWriter.WriteLine(text);
                StreamWriter.FlushAsync();

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
            catch (System.ServiceModel.CommunicationException)
            {
                IsConnected = false;
            }
        }        
    }
}
