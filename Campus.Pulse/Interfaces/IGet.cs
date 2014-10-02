using Campus.Core.Common.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface IGet
    {
        /// <summary>
        /// Gets request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request);
        /// <summary>
        /// Gets request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="sessionId">The session identifier.</param>
        /// <returns></returns>
        HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request, string sessionId);
    }
}
