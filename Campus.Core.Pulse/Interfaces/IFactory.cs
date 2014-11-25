using System;

namespace Campus.Core.Pulse.Interfaces
{
    public interface IFactory<T>
    {
        T Create(object id);
        void Register(object id, Func<T> ctor);
    }
}
