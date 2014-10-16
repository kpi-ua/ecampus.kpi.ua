using System;

namespace Campus.Core.Pulse.Interfaces
{
    public interface IPulseObject : IDisposable, IServerSentEvent
    {
        int Id { get; }
    }    
}
