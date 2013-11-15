using Newtonsoft.Json;
using System;


namespace Campus.Core
{
    public class Result
    {
        public String Status { get; set; }
        public DateTime TimeStamp { get; private set; }
        public String Guid { get; private set; }
        
        /// <summary>
        /// Paging information. If null - information is complex object 
        /// </summary>
        public Paging Paging { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public dynamic Data { get; set; }

        public Result()
        {
            Status = Campus.Core.Status.OK;
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
