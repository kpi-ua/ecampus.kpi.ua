using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Generators;

namespace Campus.Pulse
{
    public class Message : IMessage
    {
        public string Id { get; set; }
        public string AuthorId { get; set; }
        public string Data { get; set; }
        public string EventType { get; set; }
        public string Retry { get; set; }
        public string Comment { get; set; }

        public Message(string id = null, string data = null, string eventType = null, string retry = null, string comment = null)
	    {
            Id = id; Data = data; EventType = eventType; Retry = retry; Comment = comment;
	    }
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            if (!String.IsNullOrEmpty(Id)) sb.Append("id: ").AppendLine(Id);

            if (!String.IsNullOrEmpty(EventType)) sb.Append("event: ").AppendLine(EventType);

            if (!String.IsNullOrEmpty(Data)) sb.Append("data: ").AppendLine(Output);

            if (!String.IsNullOrEmpty(Retry)) sb.Append("retry: ").AppendLine(Retry);

            if (!String.IsNullOrEmpty(Comment)) sb.Append(": ").AppendLine(Comment);

            return sb.ToString();
        }

        /// <summary>
        /// Represents message in the text/event-stream form
        /// </summary>
        /// <returns></returns>
        public virtual string ToEventStream()
        {
            return this.ToString();
        }

        public static bool IsOnlyComment(IMessage msg)
        {
            return String.IsNullOrEmpty(msg.Id) &&
                   String.IsNullOrEmpty(msg.EventType) &&
                   String.IsNullOrEmpty(msg.Data) &&
                   String.IsNullOrEmpty(msg.Retry) &&
                   !String.IsNullOrEmpty(msg.Comment);
        }

        public virtual string Output
        {
            get { return this.Data; }
        }
    }

    public class TMessage : Message, IMessage
    {
        public TemplateEngine<Message> Template { get; set; }
        public override string Output { get { return Template.Result; } }

        public TMessage(string template, string[] identefier = null, string id = null, string data = null, string eventType = null, string retry = null, string comment = null)
            :base(id, data, eventType, retry, comment)
        {
            Template = new TemplateEngine<Message>(this , template, identefier);
        }
    }

    public class MessageTemplate<T>
    {
        public TemplateEngine<T> Template { get; set; }

        public string Message { get { return Template.Result; } }

        public MessageTemplate(T obj, string template, string[] identefier = null)            
        {
            Template = new TemplateEngine<T>(obj, template, identefier);
        }
    }
}
