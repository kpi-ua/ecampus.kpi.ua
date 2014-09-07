using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Pulse
{
    public class Message : IMessage
    {
        public string Id { get; set; }
        public string Data { get; set; }
        public string EventType { get; set; }
        public string Retry { get; set; }
        public string Comment { get; set; }
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            if (!String.IsNullOrEmpty(Id)) sb.Append("id: ").AppendLine(Id);

            if (!String.IsNullOrEmpty(EventType)) sb.Append("event: ").AppendLine(EventType);

            if (!String.IsNullOrEmpty(Data)) sb.Append("data: ").AppendLine(Data);

            if (!String.IsNullOrEmpty(Retry)) sb.Append("retry: ").AppendLine(Retry);

            if (!String.IsNullOrEmpty(Comment)) sb.Append(": ").AppendLine(Comment);

            return sb.ToString();
        }

        public static bool IsOnlyComment(IMessage msg)
        {
            return String.IsNullOrEmpty(msg.Id) &&
                   String.IsNullOrEmpty(msg.EventType) &&
                   String.IsNullOrEmpty(msg.Data) &&
                   String.IsNullOrEmpty(msg.Retry) &&
                   !String.IsNullOrEmpty(msg.Comment);
        }
    }
}
