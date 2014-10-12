using Campus.Core.Common.BaseClasses;
using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.BaseClasses
{
    public class GenericFactory<T> : AbstractSingleton<GenericFactory<T>>, IFactory<T>
    {
        private GenericFactory() { _dict = new Dictionary<object, Func<T>>(); }

        private Dictionary<object, Func<T>> _dict;

        /// <summary>
        /// Creates the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentException">No type registered for this id</exception>
        public T Create(object id)
        {
            Func<T> constructor = null;
            if (_dict.TryGetValue(id, out constructor))
                return constructor();

            throw new ArgumentException("No type registered for this id");
        }

        /// <summary>
        /// Creates specified identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public Task<T> CreateAsync(object id)
        {            
            return Task.Run(() => Create(id));
        }

        /// <summary>
        /// Registers the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="ctor">The ctor.</param>
        public void Register(object id, Func<T> ctor)
        {
            _dict.Add(id, ctor);
        }               
    }
}
