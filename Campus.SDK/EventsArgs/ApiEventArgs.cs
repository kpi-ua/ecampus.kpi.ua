using System;

namespace Campus.SDK.EventsArgs
{
    public abstract class ApiEventArgs : EventArgs
    {
        public DateTime TimeStamp { get; protected set; }
        public Uri Url { get; set; }

        public ApiEventArgs()
        {
            Url = null;
            TimeStamp = DateTime.Now;
        }
    }
}
