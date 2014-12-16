using Newtonsoft.Json;
using System;
using System.Net;

namespace Campus.Core
{
    public class Result
    {
        public HttpStatusCode StatusCode { get; set; }
        public DateTime TimeStamp { get; private set; }
        public string ExecutionTime { get; set; }
        public String Guid { get; private set; }

        /// <summary>
        /// Paging information. If null - information is complex object 
        /// </summary>
        public Paging Paging { get; set; }

        /// <summary>
        /// Gets or sets the compression information. If null - data is not compressed
        /// </summary>
        /// <value>
        /// The compression.
        /// </value>
        public dynamic Compression { get; set; }

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
            Compression = null;
        }

        public static Result Parse(string json)
        {
            return JsonConvert.DeserializeObject<Result>(json);
        }
    }
}
