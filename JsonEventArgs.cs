using System;

namespace Campus.Core
{
    public class JsonEventArgs : EventArgs
    {
        public String Value { get; set; }

        public JsonEventArgs()
        {
            Value = String.Empty;
        }

        public JsonEventArgs(String json)
        {
            Value = json;
        }
    }
}
