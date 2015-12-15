using System;
using PagedList;

namespace Campus.SDK
{
    public interface IResult : IDisposable
    {
        dynamic Data { get; set; }
        IPagedList Paging { get; set; }
        int StatusCode { get; set; }
        DateTime TimeStamp { get; }
    }
}
