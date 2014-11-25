using System;
using System.Linq;
using System.Reflection;
using Campus.Core.Common.Extensions;
using Campus.Core.Common.Exceptions;

namespace Campus.Core.Common.BaseClasses
{
    /// <summary>
    /// Base class for singleton pattern.
    /// After inheriting this the only thing you should do is to mark your constructor as private
    /// </summary>
    /// <typeparam name="T">Type</typeparam>
    /// <exception cref="Campus.Core.Common.BaseClasses.AbstractSingleton`1.ArchitectureException">You're trying to use type that should be a singleton but has public constructor</exception>
    public abstract class AbstractSingleton<T>
    {
        protected static readonly Lazy<T> _instance = new Lazy<T>(() => { return Construct<T>(); });

        /// <summary>
        /// Gets the instance.
        /// </summary>
        /// <value>
        /// The instance.
        /// </value>
        public static T Instance
        {
            get
            {
                if(OnGettingInstance != null)
                    OnGettingInstance();
                return _instance.Value;
            }
        }

        protected AbstractSingleton()
        {
        }

        /// <summary>
        /// Constructs this instance.
        /// </summary>
        /// <typeparam name="R"></typeparam>
        /// <returns></returns>
        private static R Construct<R>()
        {
            VerifyChild();
            return (R)typeof(R).Construct();
        }

        /// <summary>
        /// Verifies the child.
        /// </summary>
        /// <exception cref="Campus.Core.Common.BaseClasses.AbstractSingleton`1.ArchitectureException">You're trying to use type that should be a singleton but has public constructor</exception>
        private static void VerifyChild()
        {
            if (typeof(T).GetConstructors(BindingFlags.Public | BindingFlags.Instance).Any())
                throw new ArchitectureException("You're trying to use type that should be a singleton but has public constructor");
        }

        public static event Action OnGettingInstance = () => { };
    }
}
