using System;

namespace Campus.Core.EventsArgs
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
