using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Campus.Core.Common.Extensions;
using Campus.Core.Common.BaseClasses;
using Newtonsoft.Json;
using System.Reflection;

namespace Campus.Core.Documentation
{
    public class Method : Member
    {
        private string _caption = null;

        public Method(Member member)
            : base(member)
        {
            
        }

        public Method()
        {

        }

        [XmlIgnore]
        [JsonIgnore]
        public MethodInfo MethodInfo { get; set; }

        /// <summary>
        /// Gets the caption.
        /// </summary>
        /// <value>
        /// The caption.
        /// </value>
        [XmlIgnore]
        public string Caption
        {
            get
            {
                if (_caption != null) return _caption;

                _caption = this.Name.Split(new[] { ':' }).Last().Replace(Parent.ClearName + ".", string.Empty);
                if (_caption.Contains("("))
                {
                    _caption = _caption.Split(new[] { '(' }).First();
                }

                return _caption;
            }
        }

        /// <summary>
        /// Gets the parent.
        /// </summary>
        /// <value>
        /// The parent.
        /// </value>
        [XmlIgnore]
        [JsonIgnore]
        public Controller Parent { get; set; }

        /// <summary>
        /// Gets the name of the parent.
        /// </summary>
        /// <value>
        /// The name of the parent.
        /// </value>
        [JsonIgnore]
        public string ParentName { get { return Parent.Caption; } }

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
        /// Sets the parent.
        /// </summary>
        /// <param name="controller">The controller.</param>
        /// <exception cref="System.InvalidOperationException">Parent is already initialized</exception>
        internal void SetParent(Controller controller)
        {
            if (Parent != null) throw new InvalidOperationException("Parent is already initialized");

            Parent = controller;
        }
    }
}
