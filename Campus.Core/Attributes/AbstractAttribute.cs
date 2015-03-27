using System;
using System.Linq;
using System.Reflection;

namespace Campus.Core.Attributes
{
    public abstract class AbstractAttribute : Attribute
    {
        /// <summary>
        /// When implemented in a derived class, gets a unique identifier for this <see cref="T:System.Attribute" />.
        /// </summary>
        public override object TypeId
        {
            get { return GetType().Name; }
        }

        /// <summary>
        /// Determines whether the specified <c>info</c> has attribute.
        /// </summary>
        /// <param name="customAttributeProvider">The attribute provider</param>
        /// <param name="attribute">The attribute.</param>
        /// <param name="inherit">if set to <c>true</c> [inherit].</param>
        /// <returns></returns>
        public bool HasAttribute(ICustomAttributeProvider customAttributeProvider, Type attribute = null, bool inherit = false)
        {
            if (attribute == null)
            {
                attribute = this.GetType();
            }

            return customAttributeProvider.GetCustomAttributes(inherit).Any(attr =>
            {
                var a = attr as Attribute;
                return a.TypeId.GetType() == typeof(string) && (string)a.TypeId == attribute.Name;
            });
        }        
    }
}
