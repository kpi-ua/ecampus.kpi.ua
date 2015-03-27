using System;
using System.Net;

namespace Campus.Core
{
    public interface IResult : IDisposable
    {
        dynamic Data { get; set; }
        Paging Paging { get; set; }
        HttpStatusCode StatusCode { get; set; }
        DateTime TimeStamp { get; }
    }
}
