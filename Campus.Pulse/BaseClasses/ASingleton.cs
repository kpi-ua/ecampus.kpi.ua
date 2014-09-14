using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;

namespace Campus.Core.Common.BaseClasses
{
    public abstract class ASingleton<T>
    {
        protected static readonly Lazy<T> _instance = new Lazy<T>(() => { return Construct<T>(); });

        public static T Instance { get { return _instance.Value; } }

        protected ASingleton()
        { }

        private static R Construct<R>()
        {
            return (R)typeof(R).Construct();            
        }
    }
}
