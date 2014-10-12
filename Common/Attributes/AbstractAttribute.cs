using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Campus.Core.Common.Attributes
{
    public abstract class AbstractAttribute : Attribute
    {
        /// <summary>
        /// When implemented in a derived class, gets a unique identifier for this <see cref="T:System.Attribute" />.
        /// </summary>
        public override object TypeId
        {
            get
            {
                return GetType().Name;
            }
        }                

        /// <summary>
        /// Determines whether the specified method has attribute.
        /// </summary>
        /// <param name="method">The method.</param>
        /// <returns></returns>
        public bool HasAttribute(MethodInfo method, Type attribute = null)
        {
            if (attribute == null) attribute = this.GetType();
            return method.GetCustomAttributes().Any(a =>
            {
                return a.TypeId.GetType().Equals(typeof(string)) && (string)a.TypeId == attribute.Name;
            });
        }


        /// <summary>
        /// Determines whether the specified property has attribute.
        /// </summary>
        /// <param name="property">The property.</param>
        /// <param name="attribute">The attribute.</param>
        /// <returns></returns>
        public bool HasAttribute(PropertyInfo property, Type attribute = null)
        {
            if (attribute == null) attribute = this.GetType();
            return property.GetCustomAttributes().Any(a =>
            {
                return a.TypeId.GetType().Equals(typeof(string)) && (string)a.TypeId == attribute.Name;
            });
        }


        /// <summary>
        /// Determines whether the specified type has attribute.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="attribute">The attribute.</param>
        /// <returns></returns>
        public bool HasAttribute(TypeInfo type, Type attribute = null)
        {            
            if (attribute == null) attribute = this.GetType();            
            return type.GetCustomAttributes().Any(a => a.TypeId.GetType().Equals(typeof(string)) && (string)a.TypeId == attribute.Name);
        }


        /// <summary>
        /// Determines whether the specified parameter has attribute.
        /// </summary>
        /// <param name="parameter">The parameter.</param>
        /// <param name="attribute">The attribute.</param>
        /// <returns></returns>
        public bool HasAttribute(ParameterInfo parameter, Type attribute = null)
        {
            if (attribute == null) attribute = this.GetType();
            return parameter.GetCustomAttributes().Any(a => a.TypeId.GetType().Equals(typeof(string)) && (string)a.TypeId == attribute.Name);
        }



        /// <summary>
        /// Determines whether the specified field has attribute.
        /// </summary>
        /// <param name="field">The field.</param>
        /// <param name="attribute">The attribute.</param>
        /// <returns></returns>
        public bool HasAttribute(FieldInfo field, Type attribute = null)
        {
            if (attribute == null) attribute = this.GetType();
            return field.GetCustomAttributes().Any(a => a.TypeId.GetType().Equals(typeof(string)) && (string)a.TypeId == attribute.Name);
        }
    }
}
