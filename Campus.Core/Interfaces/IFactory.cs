using System;

namespace Campus.Core.Interfaces
{
    public interface IFactory<T>
    {
        T Create(object id, object[] parameters = null);
        void Register(object id, Func<object[], T> ctor);
    }
}
