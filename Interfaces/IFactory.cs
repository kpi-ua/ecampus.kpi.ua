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
        void Register(object id, Func<object> ctor);
    }

    public interface IFactory<T>
    {
        T Create(object id);
        void Register(object id, Func<T> ctor);
    }
}
