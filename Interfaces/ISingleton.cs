using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Interfaces
{
    public interface ISingleton<T>
    {
        T Instance { get; }
    }
}
