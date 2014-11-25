using System;

namespace Campus.Core.EventsArgs
{
    public class JsonEventArgs : ApiEventArgs
    {
        public String Value { get; set; }

        public JsonEventArgs(String json, Uri url)
            : base()
        {
            Url = url;
            Value = json;
        }
    }
}
