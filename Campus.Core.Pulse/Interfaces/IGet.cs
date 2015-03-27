using Campus.Core.Pulse.Attributes;
using System.Net.Http;

namespace Campus.Core.Pulse.Interfaces
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
