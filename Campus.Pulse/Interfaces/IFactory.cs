using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface IFactory
    {
        object Create(object id);
        void Register(int id, Func<object> ctor);
    }

    public interface IFactory<T> : IFactory
    {
        T Create(object id);
        void Register(int id, Func<T> ctor);
    }
}
