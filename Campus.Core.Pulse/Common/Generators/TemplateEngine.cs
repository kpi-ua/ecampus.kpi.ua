using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Campus.Core.Common.Extensions;

namespace Campus.Core.Common.Generators
{
    public class TemplateEngine<T>
    {
        #region Members
        public string[] Identifier { get; protected set; }
        public string Template { get; set; }
        public string Result { get; protected set; }        
        public string RegExp
        {
            get
            {
                return _regExp.Replace("{", Identifier[0]).Replace("}", Identifier[1]);
            }
            protected set
            {
                _regExp = value;
            }
        }
        private string _regExp = @"(\w*)(\{(\w+)\})(\w*)";

        protected List<PropertyInfo> _properties;
        protected T _obj;

        #endregion


        /// <summary>
        /// Initializes a new instance of the <see cref="TemplateEngine{T}"/> class.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <param name="template">The template.</param>
        /// <param name="identifier">The identifier.</param>
        public TemplateEngine(T obj, string template, string[] identifier)
        {
            _obj = obj;
            Template = template;
            Identifier = identifier ?? new[] { "{", "}" };

            GetProperties();
            BuildTemplate();
        }


        /// <summary>
        /// Gets the properties.
        /// </summary>
        private void GetProperties()
        {
            _properties = _obj.GetType().GetProperties().ToList();
        }


        /// <summary>
        /// Builds the template.
        /// </summary>
        /// <returns></returns>
        public string BuildTemplate()
        {            
            var mc = Regex.Matches(Template, RegExp);
            var  template = new StringBuilder(Template);            
            var tasks = new LinkedList<Task>();

            foreach (Match match in mc)
            {
                tasks.AddLast(Task.Run(() =>
                {
                    var property = _properties.First(p => Identifier[0] + p.Name + Identifier[1] == match.Value);
                    var propertyValue = property.GetValue(_obj, null);
                    var result = Identifier[0] + property.Name + Identifier[1];
                    if (property != null)
                    {
                        lock(this)
                        {
                            template = template.Replace(result, propertyValue.ToString());
                        }
                    }
                }));
            }
            Task.WaitAll(tasks.ToArray());
            return Result = template.ToString();
        }
    }
}
