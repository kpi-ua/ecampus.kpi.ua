using Newtonsoft.Json;
using System;
using System.Net;
using PagedList;

namespace Campus.SDK
{
    public class Result
    {
        public HttpStatusCode StatusCode { get; set; }
        public DateTime TimeStamp { get; private set; }
        public String Guid { get; private set; }
        
        /// <summary>
        /// Paging information. If null - information is complex object 
        /// </summary>
        public IPagedList Paging { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public dynamic Data { get; set; }

        public Result()
        {
            StatusCode = HttpStatusCode.OK;
            TimeStamp = DateTime.Now;
            Guid = System.Guid.NewGuid().ToString();
            Paging = null;
        }

        public static Result Parse(string json)
        {
            return JsonConvert.DeserializeObject<Result>(json);
        }
    }
}
