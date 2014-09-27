using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Campus.Core.Common.Extensions
{
    public static class ObjectExtensions
    {

        /// <summary>
        /// To the json.
        /// </summary>
        /// <param name="result">The result.</param>
        /// <param name="format">The format.</param>
        /// <returns></returns>
        public static string ToJson(this Object result, Formatting format = Formatting.None)
        {
            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                Formatting = format,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            };

            settings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();

            var json = JsonConvert.SerializeObject(result, settings);
            return json;           
        }
    }
}
