using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Campus.Core.Documentation
{
    public class XmlDocumentation
    {
        //private static Lazy<XmlDocumentation> _instance = new Lazy<XmlDocumentation>(() => { return new XmlDocumentation(); });        

        public static Doc Documentation
        {
            get
            {
                if (_documentation == null)
                {
                    if (_generationTask == null)
                    {
                        _generationTask = Task.Run(() => Generate());
                    }
                    else
                    {
                        if (!_generationTask.IsCompleted)
                            _generationTask.Wait();
                    }
                }

                return _documentation;
            }
        }

        private static Doc _documentation;
        private static Task _generationTask;

        public static void Generate()
        {
            if (_documentation != null) return;
            if (_documentation == null && _generationTask != null)
            { _generationTask.Wait(); return; }

            XmlSerializer serializer = new XmlSerializer(typeof(Doc), new XmlRootAttribute("doc"));

            // A FileStream is needed to read the XML document.
            using (FileStream fs = new FileStream(ApiController.DocumentationFilePath, FileMode.Open))
            {
                XmlReader reader = XmlReader.Create(fs);

                _documentation = serializer.Deserialize(reader) as Doc;
            }

            Documentation.InitControllers();
        }

        public XmlDocumentation()
        {
            Generate();
        }
    }
}
