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
        HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request);
        HttpResponseMessage Get([NonSerializableParameter]HttpRequestMessage request, string sessionId);
    }
}
