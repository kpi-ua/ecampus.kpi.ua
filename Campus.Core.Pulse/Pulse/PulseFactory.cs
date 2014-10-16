using Campus.Core.Common.BaseClasses;
using Campus.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;

namespace Campus.Pulse
{
    public class PulseFactory : AbstractSingleton<PulseFactory>
    {
        /// <summary>
        /// Prevents a default instance of the <see cref="PulseFactory"/> class from being created.
        /// </summary>
        private PulseFactory() 
        {
            _collection = PulseCollection.Instance;            
        }

        /// <summary>
        /// Gets the identifier.
        /// </summary>
        /// <returns></returns>
        protected virtual int GetID()
        {
            return "simplePulseObject".GetHashCode();
        }

        protected PulseCollection _collection;

        /// <summary>
        /// Creates the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentException">No type registered for this id</exception>
        public virtual IPulseObject Create()
        {
            var id = GetID();
            if (_collection.Any(o => o.Id.Equals(id)))
                return _collection.First(o => o.Id.Equals(id));

            throw new ArgumentException("No type registered for this id");
        }        

        /// <summary>
        /// Creates specified identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public Task<IPulseObject> CreateAsync()
        {            
            return Task.Run(() => Create());
        }

        /// <summary>
        /// Registers this instance in factory
        /// </summary>
        public virtual void Register(Func<int> getId)
        {
            var id = "simplePulseObject".GetHashCode();
            if (!_collection.Any(o => o.Equals(id)))                
            _collection.Add(new Campus.Pulse.ServerSendEvent.PulseObject(getId));
        }        
    }

    public class PulseFactory<T> : AbstractSingleton<PulseFactory<T>> where T : class
    {
        /// <summary>
        /// Gets the identifier.
        /// </summary>
        /// <returns></returns>
        protected virtual int GetID()
        {
            return typeof(T).GetHashCode();
        }

        /// <summary>
        /// Prevents a default instance of the <see cref="PulseFactory{T}"/> class from being created.
        /// </summary>
        private PulseFactory()
        {
            _collection = PulseCollection.Instance;            
        }        

        protected PulseCollection _collection;

        /// <summary>
        /// Creates the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentException">No type registered for this id</exception>
        public virtual IPulseObject Create()
        {
            var id = GetID();
            if (_collection.Any(o => o.Id.Equals(id)))
                return _collection.First(o => o.Id.Equals(id));

            throw new ArgumentException("No type registered for this id");
        }

        /// <summary>
        /// Creates specified identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        public Task<IPulseObject> CreateAsync()
        {
            return Task.Run(() => Create());
        }

        /// <summary>
        /// Registers this instance in factory.
        /// </summary>
        public virtual void Register(Func<T> getTObject)
        {
            var id = GetID();
            if (!_collection.Any(o => o.Equals(id)))
                _collection.Add(new Campus.Pulse.PulseController<T>.PulseObject<T>(getTObject));
        }
    }
}
