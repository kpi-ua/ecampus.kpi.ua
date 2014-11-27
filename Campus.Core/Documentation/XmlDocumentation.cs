using Campus.Core.Common.BaseClasses;
using Campus.Core.Common.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class XmlDocumentation
    {
        private static XmlDocumentation _instance;
        private static Task _generationTask;

        public static XmlDocumentation Instance
        {
            get
            {
                if (_instance == null)
                {
                    if (_generationTask == null)
                    {
                        _generationTask = Task.Run(() => Generate());
                    }
                    else
                    {
                        if (!_generationTask.IsCompleted)
                        {
                            _generationTask.Wait();
                        }
                    }
                }

                return _instance;
            }
        }

        public static void Generate()
        {
            if (_instance != null)
            {
                return;
            }

            if (_instance == null && _generationTask != null)
            {
                _generationTask.Wait();
                return;
            }

            if (!File.Exists(ApiController.DocumentationFilePath))
            {
                return;
            }

            var serializer = new XmlSerializer(typeof(XmlDocumentation), new XmlRootAttribute("doc"));

            // A FileStream is needed to read the XML document.
            using (var stream = new FileStream(ApiController.DocumentationFilePath, FileMode.Open))
            {
                var reader = XmlReader.Create(stream);

                _instance = serializer.Deserialize(reader) as XmlDocumentation;
            }

            Instance.InitControllers();
        }

        /// <summary>
        /// ELEMENTS
        /// </summary>
        [XmlElement("assembly")]
        public Assembly Assembly { get; set; }

        [XmlElement("members")]
        public Members Members { get; set; }

        [XmlIgnore]
        public List<Controller> Controllers { get; private set; }

        private void InitControllers()
        {
            var tasks = new List<Task>();

            if (Controllers == null && Members != null)
            {
                var assembly = AppDomain.CurrentDomain.GetAssemblies().First(a => a.FullName.Contains(ApiController.DocumentationProviderProject));

                var cntrls = Members.Member.Select(o => string.Join(".", o.Name.Split(new[] { ':' })[1].Split(new char[] { '.' }, 4).Take(3).ToArray())).Distinct().Where(o => o.Split(new char[] { '.' })[2].Contains("Controller"));
                Controllers = Members.Member.Where(o => cntrls.Contains(o.Name.Split(new[] { ':' })[1]))
                    .Distinct()
                    .DecorateAll<Controller>()
                    .ToList();

                Controllers.AddRange(cntrls.Except(Controllers.Select(o => o.Name)).Select(o => new Controller { Name = o }));

                tasks.Add(Controllers.ForEachAsync(c =>
                    {
                        c.Type = assembly.GetTypes().First(t => t.Name.Equals(c.Caption));
                        c.GetMethods(Members);
                    }));
            }

            Task.WaitAll(tasks.ToArray());
        }

        public XmlDocumentation()
        {
            // registering types in factory
            GenericFactory<Member>.Instance.Register((parameters) => { return new Member((Member)parameters[0]); });
            GenericFactory<Method>.Instance.Register((parameters) => { return new Method((Member)parameters[0]); });
            GenericFactory<Controller>.Instance.Register((parameters) => { return new Controller((Member)parameters[0]); });
        }
    }
}
