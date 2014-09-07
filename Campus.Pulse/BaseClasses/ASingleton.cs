using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.BaseClasses
{
    public abstract class ASingleton<T>
    {
        protected static readonly Lazy<T> _instance = new Lazy<T>(() => { return Activator.CreateInstance<T>(); });

        public static T Instance { get { return _instance.Value; } set { Console.WriteLine("Cannot set value!"); } }
    }
}
