using System.Linq;
using System.Reflection;
using System.Web.Http;

namespace Campus.Core
{
    /// <summary>
    /// Base class for campus api-controllers
    /// </summary>
    public abstract class XController : ApiController
    {
        public const string JsonMimeType = "application/json";

        public Result Result(object obj)
        {
            return new Result()
            {
                Data = obj
            };
        }
        
        private static dynamic IntrospectMethod(MethodInfo method)
        {
            return new
                {
                    method.Name,
                    Parameters = method.GetParameters().Select(o => new
                        {
                            o.Name,
                            Type = o.ParameterType.ToString()
                        }).ToList()
                };
        }
    }
}
