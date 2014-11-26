using System;
using System.ComponentModel;
using System.Xml.Schema;
using System.Xml.Serialization;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Campus.Core.Common.BaseClasses;
using Campus.Core.Common.Extensions;

namespace Campus.Core.Documentation
{

    public class Doc
    {

        // ELEMENTS
        [XmlElement("assembly")]
        public Assembly Assembly { get; set; }

        [XmlElement("members")]
        public Members Members { get; set; }

        [XmlIgnore]
        public List<Controller> Controllers { get; private set; }

        internal void InitControllers()
        {
            List<Task> tasks = new List<Task>();
            if (Controllers == null && Members != null)
            {
                var assembly = AppDomain.CurrentDomain.GetAssemblies().First(a => a.FullName.Contains(ApiController.DocumentationProviderProject));                

                var cntrls = Members.Member.Select(o => string.Join(".", o.Name.Split(new char[] { ':' })[1].Split(new char[]{'.'}, 4).Take(3).ToArray())).Distinct().Where(o => o.Split(new char[]{'.'})[2].Contains("Controller"));
                Controllers = Members.Member.Where(o => cntrls.Contains(o.Name.Split(new char[] { ':' })[1]))
                    .Distinct()
                    .DecorateAll<Controller>()
                    .ToList();

                Controllers.AddRange(cntrls.Except(Controllers.Select(o => o.Name)).Select<string, Controller>(o => { return new Controller { Name = o};}));

                tasks.Add(Controllers.ForEachAsync(c =>
                    {
                        c.Type = assembly.GetTypes().First(t => t.Name.Equals(c.Caption));
                        c.GetMethods(Members);
                    }));
            }

            Task.WaitAll(tasks.ToArray());
        }        

        // CONSTRUCTOR
        public Doc()
        {
            // registering types in factory
            GenericFactory<Member>.Instance.Register((parameters) => { return new Member((Member)parameters[0]); });
            GenericFactory<Method>.Instance.Register((parameters) => { return new Method((Member)parameters[0]); });
            GenericFactory<Controller>.Instance.Register((parameters) => { return new Controller((Member)parameters[0]); });
        }
    }
}
