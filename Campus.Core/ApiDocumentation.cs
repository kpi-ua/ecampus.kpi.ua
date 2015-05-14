using Campus.SDK.Documentation;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml.Serialization;

namespace Campus.Core
{
    [XmlRoot(ElementName = "doc")]
    public class ApiDocumentation
    {
        public static ApiDocumentation Load()
        {
            try
            {
                var xml = File.ReadAllText(ApiController.DocumentationFilePath);

                var stream = new MemoryStream();
                var writer = new StreamWriter(stream);
                writer.Write(xml);
                writer.Flush();
                stream.Position = 0;


                var serializer = new XmlSerializer(typeof(ApiDocumentation), new XmlRootAttribute("doc"));
                return (ApiDocumentation)serializer.Deserialize(stream);
            }
            catch
            {
                return null;
            }
        }

        private static ApiDocumentation _instance;

        public static string GetDescription(MethodInfo methodInfo, ParameterInfo parameterInfo)
        {
            string result = null;

            if (String.IsNullOrEmpty(ApiController.DocumentationFilePath))
            {
                result = String.Format("{0} {1}", methodInfo, parameterInfo);
            }
            else
            {
                if (_instance == null)
                {
                    _instance = Load();
                }

                try
                {
                    var arguments = methodInfo.GetParameters().Select(o => o.ParameterType);

                    var name = String.Format("M:{0}.{1}({2})", methodInfo.DeclaringType.FullName, methodInfo.Name,
                        String.Join(",", arguments));

                    var member = _instance.Members.SingleOrDefault(o => o.Name == name);

                    if (parameterInfo == null && member != null)
                    {
                        result = member.Summary;
                    }

                    if (parameterInfo != null && member != null)
                    {
                        var param = member.Param.SingleOrDefault(o => o.Name == parameterInfo.Name);
                        if (param != null)
                        {
                            result = param.Value;
                        }
                    }
                }
                catch { }
            }

            result = String.IsNullOrEmpty(result) ? String.Empty : result.Trim();

            return result;
        }

        [XmlElement("assembly")]
        public Campus.SDK.Documentation.Assembly Assembly { get; set; }

        [XmlArray("members")]
        [XmlArrayItem("member")]
        public Member[] Members { get; set; }
    }

}