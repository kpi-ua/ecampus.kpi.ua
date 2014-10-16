using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface IPulseObject : IDisposable, IServerSentEvent
    {
        int Id { get; }
    }    
}
