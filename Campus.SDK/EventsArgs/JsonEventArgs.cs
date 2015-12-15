using System;

namespace Campus.SDK.EventsArgs
{
    public class JsonEventArgs : ApiEventArgs
    {
        public String Value { get; set; }

        public JsonEventArgs(String json, Uri url)
        {
            Url = url;
            Value = json;
        }
    }
}
