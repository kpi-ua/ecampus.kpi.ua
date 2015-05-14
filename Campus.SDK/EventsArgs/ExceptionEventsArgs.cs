using System;

namespace Campus.SDK.EventsArgs
{
    public class ExceptionEventsArgs : ApiEventArgs
    {
        public Exception Exception { get; set; }

        public ExceptionEventsArgs(Exception exception, Uri url)
        {
            Exception = exception;
            Url = url;
        }
    }
}
