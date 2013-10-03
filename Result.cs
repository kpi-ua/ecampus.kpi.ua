using System;
using Newtonsoft.Json;

namespace Campus.Core
{
    public class Result
    {
        public String Status { get; set; }
        public DateTime TimeStamp { get; private set; }
        public String Guid { get; private set; }
        public Object Data { get; set; }

        public Result()
        {
            TimeStamp = DateTime.Now;
            Guid = System.Guid.NewGuid().ToString();
        }

        public static Result Parse(string json)
        {
            return JsonConvert.DeserializeObject<Result>(json);
        }
    }
}
