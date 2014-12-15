using Campus.Core.Common.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class Controller : Member
    {
        [NonSerialized]
        private List<Method> _methods;
        public Controller(Member member)
            : base(member)
        {
        }

        public Controller()
        {
        }

        /// <summary>
        /// Gets the caption.
        /// </summary>
        /// <value>
        /// The caption.
        /// </value>
        [XmlIgnore]
        [JsonIgnore]
        internal string ClearName
        {
            get { return this.Name.Split(new[] { ':' }).Last(); }
        }

        /// <summary>
        /// Gets the caption.
        /// </summary>
        /// <value>
        /// The caption.
        /// </value>
        [XmlIgnore]
        public string Caption
        {
            get { return this.ClearName.Split(new[] { '.' }).Last(); }
        }

        /// <summary>
        /// Gets the type.
        /// </summary>
        /// <value>
        /// The type.
        /// </value>
        [JsonIgnore]
        public Type Type { get; internal set; }

        /// <summary>
        /// Gets the methods.
        /// </summary>
        /// <value>
        /// The methods.
        /// </value>
        [JsonIgnore]
        public List<Method> Methods
        {
            get { return _methods; }
            set { _methods = value; }
        }

        /// <summary>
        /// Returns a <see cref="System.String" /> that represents this instance.
        /// </summary>
        /// <returns>
        /// A <see cref="System.String" /> that represents this instance.
        /// </returns>
        public override string ToString()
        {
            return this.Caption;
        }

        /// <summary>
        /// Gets the methods.
        /// </summary>
        /// <param name="members">The members.</param>
        /// <exception cref="System.InvalidOperationException">Methods are already initialized</exception>
        internal void GetMethods(Members members)
        {
            if (_methods != null)
            {
                throw new InvalidOperationException("Methods are already initialized");
            }

            _methods = members.Member.AsParallel().Where(m => m.Name.Split(new[] { ':' }).Last().Contains(ClearName)).DecorateAll<Method>().ToList(); ;

            _methods.ForEach(method => method.SetParent(this));
            _methods.RemoveAll(m => m.Caption.Equals(string.Empty) || m.Caption.Equals(ClearName));

            _methods.ForEach(method => method.MethodInfo = this.Type.GetMethods().FirstOrDefault(m =>
            {
                return m.ReflectedType.FullName + "." + m.Name +
                       (m.GetParameters().Any()
                           ? "(" + string.Join(",", m.GetParameters().Select(r => r.ParameterType.FullName)) + ")"
                           : "") == method.Name.Split(new[] { ':' })[1];
            }));
        }
    }
}
