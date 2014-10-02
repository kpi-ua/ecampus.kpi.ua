using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Generators;
using Campus.Core.Common.Extensions;
using Newtonsoft.Json;

namespace Campus.Pulse
{
    [JsonObject]
    public class Message : IMessage
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the author identifier.
        /// </summary>
        /// <value>
        /// The author identifier.
        /// </value>
        public string AuthorId { get; set; }

        /// <summary>
        /// Gets or sets the message title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public object Data { get; set; }

        /// <summary>
        /// Gets or sets the type of the event.
        /// </summary>
        /// <value>
        /// The type of the event.
        /// </value>
        public string EventType { get; set; }

        /// <summary>
        /// Gets or sets the retry.
        /// </summary>
        /// <value>
        /// The retry.
        /// </value>
        public string Retry { get; set; }

        /// <summary>
        /// Gets or sets the comment.
        /// </summary>
        /// <value>
        /// The comment.
        /// </value>
        public string Comment { get; set; }

        /// <summary>
        /// Gets the output.
        /// </summary>
        /// <value>
        /// The output.
        /// </value>
        [JsonIgnore]
        public virtual string Output
        {
            get { return this.Data.ToJson(); }
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="Message"/> class.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="data">The data.</param>
        /// <param name="title">The title.</param>
        /// <param name="eventType">Type of the event.</param>
        /// <param name="retry">The retry.</param>
        /// <param name="comment">The comment.</param>
        public Message(string id = null, string data = null, string title = null, string eventType = null, string retry = null, string comment = null)
	    {
            Id = id; Data = data; EventType = eventType; Retry = retry; Comment = comment; Title = title;
	    }

        /// <summary>
        /// Returns a <see cref="System.String" /> that represents this instance.
        /// </summary>
        /// <returns>
        /// A <see cref="System.String" /> that represents this instance.
        /// </returns>
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();            
            if (!String.IsNullOrEmpty(Id)) sb.Append("id: ").AppendLine(Id);

            if (!String.IsNullOrEmpty(EventType)) sb.Append("event: ").AppendLine(EventType);

            if (Data != null) sb.Append("data: ").AppendLine(Output);

            if (!String.IsNullOrEmpty(Retry)) sb.Append("retry: ").AppendLine(Retry);

            if (!String.IsNullOrEmpty(Comment)) sb.Append("comment: ").AppendLine(Comment);            

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


        /// <summary>
        /// Determines whether [is only comment] [the specified MSG].
        /// </summary>
        /// <param name="msg">The MSG.</param>
        /// <returns></returns>
        public static bool IsOnlyComment(IMessage msg)
        {
            return String.IsNullOrEmpty(msg.Id) &&
                   String.IsNullOrEmpty(msg.EventType) &&
                   msg.Data == null &&
                   String.IsNullOrEmpty(msg.Retry) &&
                   !String.IsNullOrEmpty(msg.Comment);
        }

        /// <summary>
        /// Determines whether the specified <see cref="System.Object" />, is equal to this instance.
        /// </summary>
        /// <param name="obj">The <see cref="System.Object" /> to compare with this instance.</param>
        /// <returns>
        ///   <c>true</c> if the specified <see cref="System.Object" /> is equal to this instance; otherwise, <c>false</c>.
        /// </returns>
        public override bool Equals(object obj)
        {
            return this.ToString().Equals(obj.ToString());
        }

        /// <summary>
        /// Returns a hash code for this instance.
        /// </summary>
        /// <returns>
        /// A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table. 
        /// </returns>
        public override int GetHashCode()
        {
            return this.ToString().GetHashCode();
        }
    }

    public class TMessage : Message, IMessage
    {
        /// <summary>
        /// Gets or sets the template.
        /// </summary>
        /// <value>
        /// The template.
        /// </value>
        [JsonIgnore]
        public TemplateEngine<Message> Template { get; set; }
        /// <summary>
        /// Gets the output.
        /// </summary>
        /// <value>
        /// The output.
        /// </value>
        [JsonIgnore]
        public override string Output { get { return Template.Result; } }


        /// <summary>
        /// Initializes a new instance of the <see cref="TMessage"/> class.
        /// </summary>
        /// <param name="template">The template.</param>
        /// <param name="identefier">The identifier.</param>
        /// <param name="id">The identifier.</param>
        /// <param name="data">The data.</param>
        /// <param name="eventType">Type of the event.</param>
        /// <param name="retry">The retry.</param>
        /// <param name="comment">The comment.</param>
        public TMessage(string template, string[] identefier = null, string id = null, string data = null, string eventType = null, string retry = null, string comment = null)
            :base(id, data, eventType, retry, comment)
        {
            Template = new TemplateEngine<Message>(this , template, identefier);
        }
    }

    public class MessageTemplate<T>
    {
        /// <summary>
        /// Gets or sets the template.
        /// </summary>
        /// <value>
        /// The template.
        /// </value>
        [JsonIgnore]
        public TemplateEngine<T> Template { get; set; }

        /// <summary>
        /// Gets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        [JsonIgnore]
        public string Message { get { return Template.Result; } }


        /// <summary>
        /// Initializes a new instance of the <see cref="MessageTemplate{T}"/> class.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <param name="template">The template.</param>
        /// <param name="identefier">The identifier.</param>
        public MessageTemplate(T obj, string template, string[] identefier = null)            
        {
            Template = new TemplateEngine<T>(obj, template, identefier);
        }
    }
}
