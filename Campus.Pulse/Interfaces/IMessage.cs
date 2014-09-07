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
        string Data { get; }

        [JsonIgnore]
        string EventType { get; }

        [JsonIgnore]
        string Retry { get; set; }

        [JsonIgnore]
        string Comment { get; }
    }
}
