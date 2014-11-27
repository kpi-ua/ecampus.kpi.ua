using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;

namespace Campus.Core.Common.BaseClasses
{
    public class GenericFactory<T> : AbstractSingleton<GenericFactory<T>>
    {
        private GenericFactory() 
        { 
            _dict = new Dictionary<object, Func<object[], T>>();

            OnGettingInstance += () => 
            { 
                if(!_dict.ContainsKey(typeof(T).Name)) 
                {
                    Register((value) => (T)typeof(T).Construct());
                }
            };
        }        

        private Dictionary<object, Func<object[], T>> _dict;

        /// <summary>
        /// Creates the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentException">No type registered for this id</exception>
        public T Create(object id, object[] parameters = null)
        {
            Func<object[], T> constructor = null;
            if (_dict.TryGetValue(id, out constructor))
                return constructor(parameters);

            throw new ArgumentException("No type registered for this id");
        }

        /// <summary>
        /// Creates this instance.
        /// </summary>
        /// <returns></returns>
        public T Create(object[] parameters = null)
        {
            return Create(typeof(T).Name, parameters);
        }

        /// <summary>
        /// Creates specified identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public Task<T> CreateAsync(object id, object[] parameters = null)
        {            
            return Task.Run(() => Create(id, parameters));
        }

        /// <summary>
        /// Registers the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="ctor">The ctor.</param>
        public void Register(object id, Func<object[], T> ctor)
        {
            if (_dict.ContainsKey(id))
                _dict[id] = ctor;
            _dict.Add(id, ctor);
        }

        /// <summary>
        /// Registers the specified ctor.
        /// </summary>
        /// <remarks>Do not overrider existing one</remarks>
        /// <param name="ctor">The ctor.</param>
        public void Register(Func<object[], T> ctor)
        {
            object id = typeof(T).Name;            
                Register(id, ctor);            
        }
    }
}
