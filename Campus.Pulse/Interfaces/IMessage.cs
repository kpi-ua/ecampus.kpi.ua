using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    [JsonObject]
    public interface IMessage
    {
        string Id { get; }
        string AuthorId { get; }

        string Data { get; }

        string Output { get; }

        string EventType { get; }

        string Retry { get; set; }

        string Comment { get; }

        string ToEventStream();
    }
}
